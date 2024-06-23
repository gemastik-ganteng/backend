
import ReportModel from "../models/report.model";
import Report from "../interfaces/report.interface";
import { gfsBucket } from "../server";
import {v4 as uuidv4} from 'uuid'

export const uploadBukti = async (base64StrList: string[], report: Report) => {
	//console.log(base64StrList.length)
	if (!base64StrList || base64StrList.length === 0) {
	  console.log('No files to upload');
	  return;
	}
  
	try {
	  await Promise.all(base64StrList.map(async (base64Str) => {
		const buffer = Buffer.from(base64Str, 'base64'); // Convert Base64 string back to Buffer
		const key = generateUniqueKey(); // Replace with your logic to generate a unique key
		const writestream = gfsBucket.openUploadStream(key);
  
		return new Promise<void>((resolve, reject) => {
		  writestream.on('finish', async () => {
			const fileId = writestream.id; // Get the _id of the uploaded file
          	console.log('File uploaded with _id:', fileId);
			report.files.push(fileId.toString());
			resolve();
		  });
  
		  writestream.on('error', (err: Error) => {
			console.log('Error uploading file:', err);
			reject(err);
		  });
  
		  // Write Buffer to stream
		  writestream.write(buffer);
		  writestream.end();
		});
	  }));
  
	  console.log("Upload selesai");
	  console.log("INI REPORT " + report)
	  const newReport = new ReportModel({
		email: report.email,
		judul: report.judul,
		tanggalKejadian: report.tanggalKejadian,
		jenisKejahatan: report.jenisKejahatan,
		deskripsi: report.deskripsi,
		waktuKejadian: report.waktuKejadian,
		lokasiKejadian: report.lokasiKejadian,
		files: report.files, // overhead
	   });
	  await newReport.save();
	} catch (error) {
	  console.error("Error uploading files and saving report:", error);
	  throw error;
	}
  };
  
  // Example function to generate a unique key (replace with your own logic)
  function generateUniqueKey(): string {
	// Implement your own unique key generation logic
	return 'file_' + uuidv4(); // Example: Using timestamp as a key
  }