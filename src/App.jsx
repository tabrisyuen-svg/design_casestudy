import Admin from './Admin';

// 在 TABS 加：
{ id: 'admin', label: 'Admin', Icon: Settings }

// 在 Content 加：
{tab === 'admin' && <Admin />}
