import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js';
import styles from '../admin.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

function Analytics({ fromDate, toDate, setFromDate, setToDate }) {
    const [sortedTickets, setSortedTickets] = useState([]);
    const [ticketStats, setTicketStats] = useState({ open: 0, inProgress: 0, closed: 0, totalTickets: 0 });

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/Student');
                const students = response.data || [];
                const allTickets = students.flatMap(student => student.tickets || []);

                // Filter by date range if set
                const filteredTickets = allTickets.filter(ticket => {
                    const ticketDate = new Date(ticket.dateSubmitted);
                    if (fromDate && ticketDate < fromDate) return false;
                    if (toDate && ticketDate > toDate) return false;
                    return true;
                });

                console.log("Filtered Tickets:", filteredTickets);
                setSortedTickets(filteredTickets);

                // Calculate ticket stats for pie chart
                const stats = {
                    open: filteredTickets.filter(ticket => ticket.ticketStatus?.toLowerCase() === 'open').length,
                    inProgress: filteredTickets.filter(ticket => ticket.ticketStatus?.toLowerCase() === 'in-progress').length,
                    closed: filteredTickets.filter(ticket => ticket.ticketStatus?.toLowerCase() === 'closed').length,
                    totalTickets: filteredTickets.length
                };
                setTicketStats(stats);

            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, [fromDate, toDate]);  // Refetch when date range changes

    // Normalize and sort dates for Line Chart
    const ticketDates = sortedTickets.map(ticket => {
        return new Date(ticket.dateSubmitted).toLocaleDateString('en-CA');
    });

    const closedTicketDates = sortedTickets
        .filter(ticket => ticket.ticketStatus?.toLowerCase() === 'closed')
        .map(ticket => {
            return new Date(ticket.dateSubmitted).toLocaleDateString('en-CA');
        });

    const dateCountMap = ticketDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const closedDateCountMap = closedTicketDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const allDates = Array.from(new Set([...Object.keys(dateCountMap), ...Object.keys(closedDateCountMap)]))
        .sort((a, b) => new Date(a) - new Date(b));

    const submittedCounts = allDates.map(date => dateCountMap[date] || 0);
    const closedCounts = allDates.map(date => closedDateCountMap[date] || 0);

    console.log("Dates:", allDates, "Submitted:", submittedCounts, "Closed:", closedCounts);

    // Line Chart Data
    const lineData = {
        labels: allDates,
        datasets: [
            {
                label: 'Tickets Submitted',
                data: submittedCounts,
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Tickets Closed',
                data: closedCounts,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255,99,132,0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const pieData = {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [
            {
                label: 'Ticket Status',
                data: [
                    ticketStats.open || 0,
                    ticketStats.inProgress || 0,
                    ticketStats.closed || 0
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
            },
        ],
    };

    const lineOptions = {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: Math.max(...submittedCounts, ...closedCounts) + 1,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        }
    };

    return (
        <div className={styles.analyticsSection}>
            <h3>Ticket Analytics</h3>
            <div className={styles.dateFilters}>
                <div className={styles.datePicker}>
                    <label>From:</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        className={`${styles.dateInput} custom-datepicker`}
                    />
                </div>
                <div className={styles.datePicker}>
                    <label>To:</label>
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        className={`${styles.dateInput} custom-datepicker`}
                    />
                </div>
            </div>
            <div className={styles.analyticsContainer}>
                <div className={styles.chartContainer}>
                    {ticketStats.totalTickets > 0 ? (
                        <Pie data={pieData} />
                    ) : (
                        <p style={{ textAlign: 'center', color: '#777' }}>No data available for charts.</p>
                    )}
                </div>
                <div className={styles.stats}>
                    <p><strong>Open Tickets:</strong> {ticketStats.open || 0}</p>
                    <p><strong>In Progress Tickets:</strong> {ticketStats.inProgress || 0}</p>
                    <p><strong>Closed Tickets:</strong> {ticketStats.closed || 0}</p>
                    <p><strong>Total Tickets:</strong> {ticketStats.totalTickets || 0}</p>
                </div>
            </div>
            <div>
                {ticketStats.totalTickets > 0 ? (
                    <Line data={lineData} options={lineOptions} />
                ) : (
                    <p style={{ textAlign: 'center', color: '#777' }}>No data available for charts.</p>
                )}
            </div>
        </div>
    );
}

export default Analytics;
