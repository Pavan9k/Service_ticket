import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from '../admin.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics({ ticketStats = {}, fromDate, toDate, setFromDate, setToDate }) {
    const [sortedTickets, setSortedTickets] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'ticketId', direction: 'ascending' });
    const [selectedTicket, setSelectedTicket] = useState(null);

    // useEffect(() => {
    //     setSortedTickets(tickets);
    // }, [tickets]);

   

    const pieData = {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [
            {
                label: 'Ticket Status',
                data: [
                    ticketStats?.open || 0, 
                    ticketStats?.inProgress || 0, 
                    ticketStats?.closed || 0
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
            },
        ],
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
                        <p style={{ textAlign: 'center', color: '#777' }}>No data available for pie chart.</p>
                    )}
                </div>
                <div className={styles.stats}>
                    <p><strong>Open Tickets:</strong> {ticketStats?.open || 0}</p>
                    <p><strong>In Progress Tickets:</strong> {ticketStats?.inProgress || 0}</p>
                    <p><strong>Closed Tickets:</strong> {ticketStats?.closed || 0}</p>
                    <p><strong>Total Tickets:</strong> {ticketStats?.totalTickets || 0}</p>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
