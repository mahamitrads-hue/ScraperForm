import { useState } from 'react';
import ScraperForm from './components/ScraperForm';
import DataTable from './components/DataTable';

interface DataRow {
  SchoolName: string;
  Number: string;
  Address: string;
  Website: string;
  Email: string | null;
  ResponseNotCustomerSupport: string | null;
  id: number;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [data, setData] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [industry, setIndustry] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleSendEmail = async () => {
    if (data.length === 0) return;

    setIsSendingEmail(true);
    setEmailSuccess(false);
    setError(null);

    try {
      const response = await fetch('https://n8n.srv1070691.hstgr.cloud/webhook/5fd464b5-0bdc-42b7-9525-282f0e4e7e33', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = async (ind: string, location: string) => {
    setIndustry(ind);
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    setEmailSuccess(false);
    setLoadingMessage('Starting to scrape data...');

    const messages = [
      `Started scraping ${ind} data...`,
      `Gathering business information...`,
      `Fetching phone numbers...`,
      `Retrieving email addresses...`,
      `Collecting website URLs...`,
      `Processing location data...`,
      `Almost done, compiling results...`,
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        setLoadingMessage(messages[messageIndex]);
        messageIndex++;
      }
    }, 40000);

    try {
      const response = await fetch('https://n8n.srv1070691.hstgr.cloud/webhook/bbc8b46e-ca71-4f08-911c-47ca55704afa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Industry: ind,
          Location: location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from webhook');
      }

      const result = await response.json();
      const normalizedData = (result.data || []).map((item: any) => ({
        SchoolName: item.SchoolName || item.schoolName || '',
        Number: item.Number || item.number || '',
        Address: item.Address || item.address || '',
        Website: item.Website || item.website || 'N/A',
        Email: item.Email || item.email || null,
        ResponseNotCustomerSupport: item.ResponseNotCustomerSupport || item.responseNotCustomerSupport || null,
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      setData(normalizedData);
      clearInterval(messageInterval);
      setLoadingMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      clearInterval(messageInterval);
      setLoadingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Scraper</h1>
          <p className="text-gray-600">Extract business data by industry and location</p>
        </div>

        <ScraperForm onSubmit={handleSubmit} isLoading={isLoading} loadingMessage={loadingMessage} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {emailSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Success!</p>
            <p>Email sent successfully with the scraped data.</p>
          </div>
        )}

        <DataTable
          data={data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSendEmail={handleSendEmail}
          isSendingEmail={isSendingEmail}
        />
      </div>
    </div>
  );
}

export default App;
