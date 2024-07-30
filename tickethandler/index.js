import AWS from 'aws-sdk';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
const s3 = new AWS.S3();
exports.handler = async (event) => {
    const { eventName, eventDate, customerName, customerEmail } = JSON.parse(event.body);

    // Create a PDF document
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);

        const params = {
            Bucket: 'ticket-dev-ticket-bucket ',
            Key: `tickets/ticket_${customerName.replace(/\s/g, '_')}.pdf`,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        };

        try {
            await s3.upload(params).promise();
        } catch (error) {
            console.error('Error uploading PDF to S3:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error uploading PDF to S3' }),
            };
        }
    });

    // Add content to the PDF
    doc.text(`Event Name: ${eventName}`, 10, 10);
    doc.text(`Event Date: ${eventDate}`, 10, 20);
    doc.text(`Customer Name: ${customerName}`, 10, 30);
    doc.text(`Customer Email: ${customerEmail}`, 10, 40);

    // Add a logo to the PDF
    doc.image('ticketstore\ticket-app\src\assets\logo.png', 150, 10, { width: 40, height: 40 });

    // Finalize the PDF and end the stream
    doc.end();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'PDF generated and uploaded to S3' }),
    };
};