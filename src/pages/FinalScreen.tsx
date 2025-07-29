import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';



export default function FinalScreen() {
const [isLoading, setIsLoading] = useState(true); // Set to true initially as we'll fetch on mount
  const [reports, setReports] = useState([]); // State to store the fetched reports
  const [error, setError] = useState<string | null>(null); // State for error messages

 
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}api/ai/reports/`;


  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null); 

      try {
    const authToken = localStorage.getItem('authToken');

        if (!authToken) {
          setError('Authentication token not found. Please log in.');
          setIsLoading(false);
          return;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer ${authToken}`, 
          },
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message; 
            } else if (errorData && typeof errorData === 'string') {
              errorMessage = errorData;
            }
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }

       // Get the response as a Blob (for binary data like PDF)
      const blob = await response.blob();

      // Get filename from Content-Disposition header if available, otherwise default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Reporte de Punto de Partida HypatIA.pdf'; // Default filename
      if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set the desired filename for download
      document.body.appendChild(a); // Append to body (required for Firefox)
      a.click(); // Programmatically click the link to trigger download
      a.remove(); // Clean up the temporary element

      // Revoke the object URL to free up memory
      window.URL.revokeObjectURL(url);

      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError(`Error al cargar los reportes: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports(); 
  }, []); 



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">

            <CardTitle>Gracias por participar con nosotras </CardTitle>
            <p className="text-sm text-gray-600">
              Nos estaremos contactando contigo pronto para informarte sobre los próximos pasos.
            </p>
          </CardHeader>
        
        </Card>
      </div>
    </div>
  );
}

