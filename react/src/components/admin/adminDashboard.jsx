import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AdminCategories } from './categories';
import { AdminRentings } from './rentings';
import { AdminUsers } from './users';
import { AdminDresses } from './dresses';
import { AdminCharts } from './adminCharts';
import { StatusBadge } from './statusBadge';
import { getAllCategoriesThunk } from '../../redux/slices/categoriesSlice';
import { getAllRentings } from '../../API/rentingsApi';
import { getAllUsers } from '../../API/usersApi';
import { getAllDresses } from '../../API/dressesApi';
import { formatDate } from '../../utils/format';
import '../../styles/adminDashboard.css';

export function AdminDashboard()
{
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('overview');
    const [rentings, setRentings] = useState([]);
    const [users, setUsers] = useState([]);
    const [dresses, setDresses] = useState([]);

    useEffect(() =>
    {
        const initData = async () =>
        {
            try
            {
                dispatch(getAllCategoriesThunk());

                const [rData, uData, dData] = await Promise.all([
                    getAllRentings() || [],
                    getAllUsers() || [],
                    getAllDresses() || []
                ]);

                setRentings(rData);
                setUsers(uData);
                setDresses(dData);
            }
            catch(error)
            {
                console.error('שגיאה בטעינת נתוני הדשבורד:', error);
            }
        };

        initData();
    }, [dispatch]);

    const paidRentings = useMemo(
        () => rentings.filter(r => r.status === 'paid'),
        [rentings]
    );
    const pendingRentings = useMemo(
        () => rentings.filter(r => r.status !== 'paid'),
        [rentings]
    );

    const totalRevenue = useMemo(
        () => paidRentings.reduce((sum, renting) => sum + (Number(renting.totalAmount) || 0), 0),
        [paidRentings]
    );

    const averageOrder = paidRentings.length
        ? Math.round(totalRevenue / paidRentings.length)
        : 0;

    const occupiedDresses = useMemo(
        () => dresses.filter(dress => dress.status === 'rented').length,
        [dresses]
    );
    const availableDresses = useMemo(
        () => dresses.filter(dress => dress.status === 'available').length,
        [dresses]
    );

    const occupancyRate = dresses.length
        ? Math.round((occupiedDresses / dresses.length) * 100)
        : 0;

    const recentRentings = useMemo(
        () => [...rentings]
            .sort((a, b) =>
                new Date(b.createdAt || b.rentDate) -
                new Date(a.createdAt || a.rentDate)
            )
            .slice(0, 5),
        [rentings]
    );

    const chartData = useMemo(() =>
    {
        const sizeMap = rentings.reduce((acc, renting) =>
        {
            const size = renting.size || 'לא ידוע';
            acc[size] = (acc[size] || 0) + 1;
            return acc;
        }, {});

        const now = new Date();
        const revenue = [];

        for (let i = 5; i >= 0; i--)
        {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.toLocaleDateString('he-IL', { month: 'short' });

            const monthRentings = rentings.filter(renting =>
            {
                const rentingDate = new Date(renting.createdAt || renting.rentDate);

                return rentingDate.getMonth() === date.getMonth() &&
                       rentingDate.getFullYear() === date.getFullYear();
            });

            const monthRevenue = monthRentings
                .filter(renting => renting.status === 'paid')
                .reduce((sum, renting) =>
                    sum + (Number(renting.totalAmount) || 0), 0);

            revenue.push({
                month,
                revenue: monthRevenue,
                orders: monthRentings.length
            });
        }

        return {
            revenue,
            status: [
                { name: 'ממתינות', value: pendingRentings.length },
                { name: 'שולמו', value: paidRentings.length }
            ],
            sizes: Object.entries(sizeMap).map(([name, value]) => ({
                name, value
            })),
            availability: [
                { name: 'זמינות', value: availableDresses },
                { name: 'מושכרות', value: occupiedDresses }
            ]
        };
    }, [rentings, pendingRentings, paidRentings, availableDresses, occupiedDresses]);

    const tabs = [
        { id: 'overview', label: 'סקירה כללית' },
        { id: 'categories', label: 'קטגוריות' },
        { id: 'dresses', label: 'שמלות' },
        { id: 'rentings', label: 'הזמנות' },
        { id: 'users', label: 'לקוחות' }
    ];

    return (
        <div className="admin-dashboard-page">

            <div className="admin-header-section">
                <div className="admin-brand">PRIMELACE <span>ADMIN</span></div>
                <h1 className="admin-main-title">מרכז הניהול</h1>
                <p className="admin-subtitle">כל מה שקורה בעסק שלך, במקום אחד</p>
            </div>

            <div className="admin-tabs-nav">
                {tabs.map(tab =>
                    <button
                        key={tab.id}
                        className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                )}
            </div>

            <div className="admin-tab-content">

                {activeTab === 'overview' && (
                    <div className="overview-container">

                        <div className="kpi-grid">

                            <div className="kpi-card featured">
                                <span className="kpi-icon">₪</span>
                                <span className="kpi-title">הכנסות</span>
                                <span className="kpi-value">
                                    ₪{totalRevenue.toLocaleString()}
                                </span>
                                <span className="kpi-note">סה"כ מהזמנות ששולמו</span>
                            </div>

                            <div className="kpi-card">
                                <span className="kpi-icon">↗</span>
                                <span className="kpi-title">סה"כ הזמנות</span>
                                <span className="kpi-value">{rentings.length}</span>
                                <span className="kpi-note">כל ההזמנות במערכת</span>
                            </div>

                            <div className="kpi-card">
                                <span className="kpi-icon">♙</span>
                                <span className="kpi-title">לקוחות</span>
                                <span className="kpi-value">{users.length}</span>
                                <span className="kpi-note">לקוחות רשומים במערכת</span>
                            </div>

                            <div className="kpi-card">
                                <span className="kpi-icon">✦</span>
                                <span className="kpi-title">תפוסת שמלות</span>
                                <span className="kpi-value">{occupancyRate}%</span>
                                <span className="kpi-note">
                                    {occupiedDresses} מושכרות מתוך {dresses.length}
                                </span>
                            </div>

                        </div>

                        <div className="mini-stats">

                            <div>
                                <span>ממוצע להזמנה ששולמה</span>
                                <strong>₪{averageOrder.toLocaleString()}</strong>
                            </div>

                            <div>
                                <span>ממתינות לתשלום</span>
                                <strong>{pendingRentings.length}</strong>
                            </div>

                            <div>
                                <span>שולמו</span>
                                <strong>{paidRentings.length}</strong>
                            </div>

                            <div>
                                <span>שמלות זמינות</span>
                                <strong>{availableDresses}</strong>
                            </div>

                        </div>

                        <AdminCharts
                            availabilityData={chartData.availability}
                            revenueData={chartData.revenue}
                            statusData={chartData.status}
                            sizeData={chartData.sizes}
                        />

                        <div className="recent-orders">

                            <div className="recent-orders-header">
                                <div>
                                    <span className="section-label">RECENT ACTIVITY</span>
                                    <h2>הזמנות אחרונות</h2>
                                    <p>ההזמנות האחרונות שנכנסו למערכת</p>
                                </div>

                                <button onClick={() => setActiveTab('rentings')}>
                                    לכל ההזמנות ←
                                </button>
                            </div>

                            <div className="orders-table-wrapper">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>לקוחה</th>
                                            <th>שמלה</th>
                                            <th>מידה</th>
                                            <th>תאריך</th>
                                            <th>סכום</th>
                                            <th>סטטוס</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentRentings.map((renting, index) =>
                                        {
                                            const user = renting.userId;
                                            const userName = user
                                                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                : 'לקוחה';

                                            return (
                                                <tr key={renting._id || index}>

                                                    <td>
                                                        <strong>{userName || 'לקוחה'}</strong>
                                                    </td>

                                                    <td>
                                                        {renting.dressId?.name || 'שמלה'}
                                                    </td>

                                                    <td>
                                                        {renting.size || '—'}
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            renting.createdAt || renting.rentDate
                                                        )}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            ₪{(
                                                                Number(renting.totalAmount) || 0
                                                            ).toLocaleString()}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <StatusBadge
                                                            positive={renting.status === 'paid'}
                                                            positiveLabel="שולם"
                                                            negativeLabel="ממתין לתשלום"
                                                        />
                                                    </td>

                                                </tr>
                                            );
                                        })}

                                        {!recentRentings.length &&
                                            <tr>
                                                <td colSpan="6" className="empty-orders">
                                                    עדיין אין הזמנות במערכת
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>
                )}

                {activeTab === 'categories' && <AdminCategories />}
                {activeTab === 'dresses' && <AdminDresses />}
                {activeTab === 'rentings' && <AdminRentings />}
                {activeTab === 'users' && <AdminUsers />}

            </div>
        </div>
    );
}
