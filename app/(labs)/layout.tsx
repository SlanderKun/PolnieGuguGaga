import type { ReactNode } from "react";
import HomeHeader from "@/components/HomeHeader/HomeHeader";
import NavList from "@/components/NavList/NavList";

export default function LabsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HomeHeader />
            <nav
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "calc(100vh - 100px)",
                    marginTop: "100px",
                }}
            >
                <NavList />
                {children}
            </nav>
        </>
    );
}
