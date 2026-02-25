"use client";

import Navbar from "./Navbar";

export default function Root({ children }: any) {

    return (
        <>
            <Navbar></Navbar>
            {children}
        </>
    )
}
