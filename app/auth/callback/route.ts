import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { getAppKey, getProjectId } from "@/utils/supabase/project";

export const runtime = 'edge';

// 硬编码 locales 避免导入问题
const LOCALES = ["en", "zh"];
const DEFAULT_LOCALE = "en";

// 从 request cookie header 获取用户语言偏好
function getLocaleFromRequest(request: Request): string {
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const possibleCookieNames = ["NEXT_LOCALE", "locale", "next-intl-locale"];

        for (const name of possibleCookieNames) {
            const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
            if (match && LOCALES.includes(match[1])) {
                return match[1];
            }
        }
    } catch {
        // ignore
    }
    return DEFAULT_LOCALE;
}

// 解析 cookie string 为对象
function parseCookies(cookieHeader: string): { name: string; value: string }[] {
    if (!cookieHeader) return [];
    try {
        return cookieHeader.split(';').map(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            return { name: name || '', value: rest.join('=') };
        }).filter(c => c.name);
    } catch {
        return [];
    }
}

async function ensureCustomerForCurrentProject(user: { id: string; email?: string | null }) {
    const serviceSupabase = createServiceRoleClient();
    const projectId = await getProjectId(serviceSupabase);

    const { data: existingCustomer, error: existingCustomerError } = await serviceSupabase
        .from("customers")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingCustomerError) {
        throw existingCustomerError;
    }

    if (existingCustomer) {
        return;
    }

    const { data: fallbackCustomer, error: fallbackCustomerError } = await serviceSupabase
        .from("customers")
        .select("project_id, creem_customer_id, email, name, country, credits, metadata")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fallbackCustomerError) {
        throw fallbackCustomerError;
    }

    const credits = fallbackCustomer?.credits ?? 30;
    const customerEmail = fallbackCustomer?.email ?? user.email ?? "";

    const { data: insertedCustomer, error: insertCustomerError } = await serviceSupabase
        .from("customers")
        .insert({
            project_id: projectId,
            user_id: user.id,
            creem_customer_id: fallbackCustomer?.creem_customer_id ?? `auto_${user.id}`,
            email: customerEmail,
            name: fallbackCustomer?.name ?? null,
            country: fallbackCustomer?.country ?? null,
            credits,
            metadata: {
                ...(fallbackCustomer?.metadata ?? {}),
                source: fallbackCustomer ? "oauth_project_recovery" : "oauth_auto_registration",
                app_key: getAppKey(),
                recovered_from_project_id: fallbackCustomer?.project_id ?? null,
            },
        })
        .select("id")
        .single();

    if (insertCustomerError) {
        throw insertCustomerError;
    }

    const shouldInsertHistory = credits > 0;
    if (shouldInsertHistory) {
        const { error: historyError } = await serviceSupabase
            .from("credits_history")
            .insert({
                project_id: projectId,
                customer_id: insertedCustomer.id,
                amount: credits,
                type: "add",
                description: fallbackCustomer
                    ? "Recovered credits for OAuth login in current project"
                    : "Welcome bonus: 30 credits for OAuth user",
                metadata: {
                    source: fallbackCustomer ? "oauth_project_recovery" : "oauth_auto_registration",
                    app_key: getAppKey(),
                },
            });

        if (historyError) {
            throw historyError;
        }
    }
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    try {
        const code = requestUrl.searchParams.get("code");
        const errorParam = requestUrl.searchParams.get("error");
        const errorDescription = requestUrl.searchParams.get("error_description");
        const locale = getLocaleFromRequest(request);

        // 如果 OAuth 返回了错误
        if (errorParam) {
            return NextResponse.redirect(
                `${origin}/${locale}/sign-in?error=${encodeURIComponent(errorDescription || errorParam)}`
            );
        }

        if (!code) {
            return NextResponse.redirect(`${origin}/${locale}/sign-in?error=no_code`);
        }

        // 检查环境变量
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.redirect(`${origin}/${locale}/sign-in?error=config_error`);
        }

        const cookieHeader = request.headers.get("cookie") || "";
        const cookies = parseCookies(cookieHeader);
        const cookiesToSet: { name: string; value: string; options?: any }[] = [];

        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return cookies;
                },
                setAll(newCookies) {
                    cookiesToSet.push(...newCookies);
                },
            },
        });

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return NextResponse.redirect(
                `${origin}/${locale}/sign-in?error=${encodeURIComponent(error.message)}`
            );
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            return NextResponse.redirect(
                `${origin}/${locale}/sign-in?error=${encodeURIComponent(userError.message)}`
            );
        }

        if (user) {
            await ensureCustomerForCurrentProject(user);
        }

        // 成功 - 重定向到首页
        const response = NextResponse.redirect(`${origin}/${locale}`);

        // 设置 session cookies
        for (const cookie of cookiesToSet) {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
        }

        return response;

    } catch (err: any) {
        // 发生异常时返回一个安全的重定向
        return NextResponse.redirect(
            `${origin}/en/sign-in?error=${encodeURIComponent(err?.message || 'unexpected_error')}`
        );
    }
}
