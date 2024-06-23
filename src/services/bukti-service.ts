import Report from "../interfaces/report.interface";
import query from "./postgres-service";

const uploadBuktiToPG = async (laporanId: string, base64StrList: string[]) => {
	const values = base64StrList.map(base64Str => `('${laporanId}', '${base64Str}')`).join(", ");
  	const insertQuery = `
    INSERT INTO file (laporan_id, base64) VALUES ${values}
  	`;
  	await query(insertQuery);
}

export const uploadBukti = async (base64StrList: string[], report: Report) => {
	if (!base64StrList || base64StrList.length === 0) {
	  console.log('No files to upload');
	  return;
	}
	try {
	  await uploadBuktiToPG(report._id.toString(), base64StrList)
	} catch (error) {
	  console.error("Error uploading files:", error);
	  throw error;
	}
  };

export const getBuktiByByLaporanIdPG = async (laporanId: string) => {
	let base64List: string[] = []
	const res = await query(`SELECT base64 from file where laporan_id = '${laporanId}'`)
	base64List = res.rows.map((data)=>data.base64)
	return base64List
}