import React, { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import NotFound from '../utils/notFound';
import {Spin} from "antd";

const Home = lazy(() => import('../view/Home/index'));
const MapHome = lazy(() => import('../view/mapHome/index'));
const Panorama = lazy(() => import('../view/industryPanorama/index'));
const Detection = lazy(() => import('../view/industryDetection/index'));
const Analysis = lazy(() => import('../view/industryAnalysis/index'));
const Improve = lazy(() => import('../view/industryImprove/index'));
const Status = lazy(() => import('../view/status-Detection/index'));
const Detail =lazy(() => import('../view/companyDetail/index'));
const Run = lazy(() => import('../view/run-Detection/index'));
const Test = lazy(() => import('../view/test/index'));
const routes = [
    // //重定向
    // {
    //     path: '/',
    //     element: <Test/>,
    // },
    //重定向
    {
        path: '/',
        element: <Navigate to="/home" />,
    },
    {
        path: '/map-home',
        element: <Navigate to="/map-home/industry-panorama" />,
    },
    //建立路由
    {
        path: '/home',
        name: 'home',
        element: <Home />,
    },
    {
        path: '/map-home',
        element: <MapHome />,
        children: [
            {
                path: 'industry-panorama',
                name: 'industry-panorama',
                element: <Panorama />,
            },
            {
                path: 'industry-detection',
                name: 'industry-detection',
                element: <Detection />,
            },
            {
                path: 'industry-analysis',
                name: 'industry-analysis',
                element: <Analysis />,
            },
            {
                path: 'industry-improve',
                name: 'industry-improve',
                element: <Improve />,
            }
        ]
    },
    {
        path: '/status-detection',
        name: 'status-detection',
        element: <Status />,
    },
    {
        path: '/run-detection',
        name: 'run-detection',
        element: <Run />,
    },
    {
        path: '/company-detail',
        name: 'industry-improve',
        element: <Detail />,
    },
    {
        path: "*",
        element: <NotFound />,
    },

]


const spinning=true
const GetRoutes = () => {
    return (
        <Suspense fallback={<Spin spinning={spinning} fullscreen />}>
            {useRoutes(routes)}
        </Suspense>
    );
}

export default GetRoutes;
