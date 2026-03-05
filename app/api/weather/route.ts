import { NextRequest, NextResponse } from 'next/server';


/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Preuzmi trenutnu vremensku prognozu za lokaciju košnice
 *     tags: [Vreme]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Geografska širina
 *         example: 44.0165
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Geografska dužina
 *         example: 21.0059
 *     responses:
 *       200:
 *         description: Podaci o trenutnom vremenu (Open-Meteo API)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_weather:
 *                   type: object
 *                   properties:
 *                     temperature:
 *                       type: number
 *                       example: 22.5
 *                     windspeed:
 *                       type: number
 *                       example: 14.2
 *                     weathercode:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Nedostaju koordinate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Nedostaju koordinate' }, { status: 400 });
  }

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
  );

  const data = await res.json();
  return NextResponse.json(data);
}