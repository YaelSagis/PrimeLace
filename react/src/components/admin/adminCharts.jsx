import React from 'react';
import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,LineChart,Line,XAxis,YAxis,CartesianGrid,Legend,BarChart,Bar} from 'recharts';

function ChartCard({ wrapperClassName = "", label, title, subtitle, live = false, small = false, hasData, emptyText, children }) {
    return (
        <div className={`chart-wrapper ${wrapperClassName}`.trim()}>
            <div className="chart-header">
                <div>
                    <span className="section-label">{label}</span>
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                </div>
                {live && <span className="chart-live">LIVE</span>}
            </div>

            <div className={`chart-inner ${small ? "small-chart" : ""}`.trim()}>
                {hasData ? children : <div className="chart-empty">{emptyText}</div>}
            </div>
        </div>
    );
}

export function AdminCharts({ availabilityData, revenueData, statusData, sizeData }) {

    const availabilityColors = ['#9b8472', '#d8cdc4'];

    return (
        <div className="charts-grid">

            <ChartCard
                wrapperClassName="revenue-chart"
                label="BUSINESS PERFORMANCE"
                title="הכנסות והזמנות"
                subtitle="ביצועי העסק בששת החודשים האחרונים"
                live
                hasData={revenueData?.length}
                emptyText="עדיין אין מספיק נתונים"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8e2" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis yAxisId="revenue" axisLine={false} tickLine={false}
                            tickFormatter={(value) => `₪${value / 1000}K`} />
                        <YAxis yAxisId="orders" orientation="right" axisLine={false}
                            tickLine={false} allowDecimals={false} />
                        <Tooltip formatter={(value, name) =>
                            name === "הכנסות"
                                ? [`₪${Number(value).toLocaleString()}`, name]
                                : [value, name]
                        } />
                        <Legend />
                        <Line yAxisId="revenue" type="monotone" dataKey="revenue"
                            name="הכנסות" stroke="#8f7765" strokeWidth={3}
                            dot={{ r: 4 }} />
                        <Line yAxisId="orders" type="monotone" dataKey="orders"
                            name="הזמנות" stroke="#c8b9ad" strokeWidth={2}
                            strokeDasharray="5 5" dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                label="COLLECTION"
                title="מצב הקולקציה"
                subtitle="זמינות השמלות כרגע"
                hasData={availabilityData?.length}
                emptyText="עדיין אין נתוני קולקציה"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={availabilityData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={58}
                            outerRadius={82}
                            paddingAngle={4}
                        >
                            {availabilityData?.map((entry, index) => (
                                <Cell
                                    key={`availability-${index}`}
                                    fill={availabilityColors[index % availabilityColors.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value, name) => [
                                `${value} שמלות`,
                                name
                            ]}
                        />

                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                small
                label="SIZES"
                title="מידות מבוקשות"
                subtitle="לפי ההשכרות שבוצעו"
                hasData={sizeData?.length}
                emptyText="עדיין אין נתוני מידות"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sizeData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3"
                            vertical={false} stroke="#eee8e2" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" name="השכרות"
                            fill="#a38c79" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                small
                label="RENTALS"
                title="מצב ההזמנות"
                subtitle="תמונת מצב עדכנית"
                hasData={statusData?.length}
                emptyText="עדיין אין הזמנות"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} layout="vertical"
                        margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3"
                            horizontal={false} stroke="#eee8e2" />
                        <XAxis type="number" axisLine={false}
                            tickLine={false} allowDecimals={false} />
                        <YAxis type="category" dataKey="name"
                            axisLine={false} tickLine={false} width={55} />
                        <Tooltip />
                        <Bar dataKey="value" name="הזמנות"
                            fill="#b6a294" radius={[0, 6, 6, 0]} barSize={22} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

        </div>
    );
}
