import { v4 as uuidv4 } from 'uuid';
import Report from '../interfaces/report.interface';
import ReportModel from '../models/report.model';
import { gfs } from '../server';
import { ObjectId } from 'mongodb';

export const uploadBukti = async (files: Express.Multer.File[], report: Report) => {
	if (!files || files.length === 0) {
		return 
	}
	let uploadCount = 0;

	files.forEach((file) => {
		const uniqueFilename = `${uuidv4()}-${file.originalname}`;
		const writestream = gfs.createWriteStream({ filename: uniqueFilename });

		writestream.write(file.buffer);
		writestream.end();

		writestream.on('finish', () => {
            report.files.push(new ObjectId(uniqueFilename))
			uploadCount++;

			if (uploadCount === files.length) {
				return
			}
		});

		writestream.on('error', (err: Error) => {
			return
		});
	});
    const newReport = new ReportModel({ ...report })
    await newReport.save()
};