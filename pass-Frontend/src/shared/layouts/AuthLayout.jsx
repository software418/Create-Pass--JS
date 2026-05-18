import { Outlet } from "react-router-dom";
export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      {
        <div className="w-full max-w-md">
          {
            <div className="mb-8 text-center">
              {
                <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                  MERN Boilerplate
                </h1>
              }
              {
                <p className="text-muted-foreground mt-2">
                  Sign in to your account to continue
                </p>
              }
            </div>
          }
          {<Outlet />}
        </div>
      }
    </div>
  );
};
