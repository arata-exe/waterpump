import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch((err) => {
    console.error("Database connection error:", err);
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export const dynamic = "force-dynamic";

// ฟังก์ชันสำหรับการอัปเดตข้อมูลปั้มน้ำในฐานข้อมูล
export async function GET() {
    try {
        // Query to get the latest data based on the timestamp
        const result = await client.query(`
            SELECT * 
            FROM pump_control
            ORDER BY last_updated DESC
        `);

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
// -------------------------------------------------------------------------

export async function POST(request) {
    try {
        const body = await request.json();
        const { mode } = body;

        // อัปเดตสถานะปั้มน้ำในฐานข้อมูล
        const query = `
            UPDATE pump_control 
            SET mode = $1, last_updated = NOW()
            WHERE id = 1
        `;
        const values = [mode];

        await client.query(query, values);

        return new Response(JSON.stringify({ message: 'Pump control updated successfully' }), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error('Error updating data:', error);
        return new Response(JSON.stringify({ error: 'Failed to update data' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
// -------------------------------------------------------------------------

export async function PUT(request) {
    try {
        // Parse the request body as JSON
        const requestBody = await request.json();
        const { state } = requestBody;

        // Update the LED_Status in the database
        const result = await client.query(
            'UPDATE pump_control SET state = $1 WHERE id = 1  RETURNING *',
            [state]
        );

        // Check if update was successful
        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ error: "Sensor ID not found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(result.rows[0]), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
        });
    } catch (error) {
        console.error("Error updating state:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}