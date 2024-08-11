import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [emailFiles, setEmailFiles] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailFilesChange = (e) => {
    setEmailFiles(Array.from(e.target.files));
  };

  const handleExcelFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    emailFiles.forEach((file) => formData.append('email_files', file));
    formData.append('excel_file', excelFile);

    try {
      const response = await axios.post('https://outlook-api.replit.app/cross_reference/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cross Reference App</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email Files:</label>
          <input
            type="file"
            accept=".msg"
            multiple
            onChange={handleEmailFilesChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Excel File:</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleExcelFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {results && (
        <div>
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded mb-4">
                <p><strong>Customer:</strong> {result.Customer}</p>
                <p><strong>Email:</strong> {result.Email}</p>
                {result.Message ? (
                  <div>
                    <p><strong>Message:</strong> {result.Message}</p>
                    <div>
                      <p><strong>Excel Data:</strong></p>
                      <ul>
                        {Object.entries(result['Excel Data']).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p><strong>Email Data:</strong></p>
                      {result['Email Data'] && typeof result['Email Data'] === 'object' ? (
                        <ul>
                          {Object.entries(result['Email Data']).map(([key, value]) => (
                            <li key={key}>{key}: {value}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No Email Data available</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p><strong>Differences:</strong></p>
                    {typeof result.Differences === 'string' ? (
                      <p>{result.Differences}</p>
                    ) : (
                      <ul>
                        {Object.entries(result.Differences).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
