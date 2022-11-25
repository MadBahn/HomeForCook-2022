import { Navigate } from "react-router-dom";
import React,{ lazy } from "react";
import Home from "../views/Home/Home";

const Data = lazy(() => import("../views/Data/Data"));
const Notify = lazy(() => import("../views/Notify/Notify"));
const About = lazy(() => import("../views/About/About"));

const loading = (comp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) => (
    <React.Suspense fallback={<div>loading</div>}>
        {comp}
    </React.Suspense>
);

const routes = [
    {
        path: "/",
        element: <Navigate to="/home" />
    },
    {
        path: "/home",
        element: <Home />
    },
    {
        path: "/data",
        element: loading(<Data />)
    },
    {
        path: "/notify",
        element: loading(<Notify />)
    },
    {
        path: "/about",
        element: loading(<About />)
    }
];

export default routes;