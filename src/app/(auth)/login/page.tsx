import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <svg
              viewBox="0 0 32 32"
              className="w-10 h-10 fill-primary"
              aria-hidden
            >
              <path d="M16 1C10.925 1 6 5.59 6 11.5c0 3.83 2.05 7.01 4.44 9.77C12.83 24.04 16 27.5 16 27.5s3.17-3.46 5.56-6.23C23.95 18.51 26 15.33 26 11.5 26 5.59 21.075 1 16 1zm0 14a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
            </svg>
          </div>
          <CardTitle
            className="text-2xl text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ласкаво просимо до StayHub
          </CardTitle>
          <CardDescription>
            Увійдіть, щоб бронювати помешкання або здавати своє житло
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button type="submit" className="w-full gap-3" size="lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Увійти через Google
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Продовжуючи, ви погоджуєтесь з умовами використання StayHub
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
