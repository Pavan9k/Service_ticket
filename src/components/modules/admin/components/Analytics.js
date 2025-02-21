import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import styles from '../admin.module.css'

ChartJS.register(ArcElement, Tooltip, Legend);

function Analytics({ ticketStats, students, faculty }) {
    const pieData = {
        labels: ['Open', 'In Progress', 'Closed'],
        datasets: [
            {
                label: 'Ticket Status',
                data: [ticketStats.open, ticketStats.inProgress, ticketStats.closed],
                backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
            },
        ],
    };

    return (
        <div className={styles.analyticsSection}>
            <h3>Analytics</h3>
            <div className={styles.stats}>
                <p><strong>Total Students:</strong> {students.length}</p>
                <p><strong>Total Faculty:</strong> {faculty.length}</p>
                <p><strong>Total Tickets:</strong> {ticketStats.totalTickets}</p>
            </div>

            <div className={styles.chartContainer}>
                <Pie data={pieData} />
            </div>
        </div>
    );
}

export default Analytics;
