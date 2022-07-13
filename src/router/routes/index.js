import { lazy } from 'react';

// ** Document title
const TemplateTitle = '%s - Airdrop tool';

// ** Default Route
const DefaultRoute = '/bsc';

// ** Merge Routes
const Routes = [
  {
    path: '/:id',
    component: lazy(() => import('../../views/MultiSend/index')),
    exact: true,
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout',
  },
];

export { DefaultRoute, TemplateTitle, Routes };
