import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666'];

function CategoryChart({ data }) {
    // Map aggregation data to what recharts expects
    const chartData = data.map(item => ({
        name: item._id,
        value: item.total
    }));

    if (!chartData || !chartData.length) return <p>No data to display.</p>;

    return (
        <PieChart width={400} height={300}>
            <Pie 
                data={chartData} 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8" 
                dataKey="value" 
                label
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}

export default CategoryChart;