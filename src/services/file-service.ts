import ReportModel from "../models/report.model";
import { gfsBucket } from "../server";
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Fungsi untuk mengambil base64 dari sekelompok file berdasarkan array file IDs
export const getFilesBase64ByIds = async (fileIds: string[]) => {
	console.log("MASUK MEKKK")
  try {
    const base64List: string[] = [];

    // Menggunakan aggregation untuk mengambil file berdasarkan banyak ID
    const files = await gfsBucket.find({ _id: { $in: fileIds.map(id => new ObjectId(id)) } }).toArray();

    console.log("MASUK MEKI14");

    // Mengonversi setiap file ke base64
    const base64Promises = files.map(async (file: any) => {
      return new Promise<string>((resolve, reject) => {
        const buffers: any[] = [];
        const downloadStream = gfsBucket.openDownloadStream(file._id);

        downloadStream.on('data', (chunk: any) => {
          buffers.push(chunk);
        });

        downloadStream.on('error', (error: any) => {
          console.error('Error reading stream:', error.message);
          reject(error);
        });

        downloadStream.on('end', () => {
          console.log('Stream reading finished');
          const buffer = Buffer.concat(buffers);
          const base64String = buffer.toString('base64');
          resolve(base64String);
        });
      });
    });

    // Await all promises to complete
    const base64Files = await Promise.all(base64Promises);

    return base64Files;
  } catch (error) {
    console.log("error " + error);
    throw error;
  }
};

// Fungsi untuk mendapatkan data bukti berdasarkan ID laporan
export const getBuktiById = async (reportId: string) => {
  try {
    // Mengambil laporan berdasarkan ID
    const report = await ReportModel.findById(reportId).exec();

    if (!report) {
      throw new Error('Report not found');
    }

    // Panggil fungsi untuk mengambil base64 dari grup file IDs
    const base64List = await getFilesBase64ByIds(report.files);

    return base64List;
	} catch (error) {
    throw error;
  }
};