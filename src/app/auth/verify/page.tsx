import VerifyEmailLogin from "@/src/features/login/components/VerifyEmailLogin";
import { Suspense } from "react";

export default function VerifyLoginPage() {
    return (
        <Suspense fallback="Loading...">
            <VerifyEmailLogin />
        </Suspense>
    )
}