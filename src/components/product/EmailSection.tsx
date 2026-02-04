'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { FileText, Loader2 } from 'lucide-react';

interface EmailSectionProps {
  product: Product;
}

export function EmailSection({ product }: EmailSectionProps) {
  const [email, setEmail] = useState('');
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const handlePdfToggle = (pdfId: string) => {
    setSelectedPdfs((prev) =>
      prev.includes(pdfId) ? prev.filter((id) => id !== pdfId) : [...prev, pdfId]
    );
  };

  const handleSendEmail = async () => {
    if (!email || selectedPdfs.length === 0) {
      setMessage('Please enter an email and select at least one PDF');
      return;
    }

    setIsSending(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          pdfContentIds: selectedPdfs,
          productId: product._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email sent successfully!');
        setEmail('');
        setSelectedPdfs([]);
      } else {
        setMessage(`Error: ${data.error || 'Failed to send email'}`);
      }
    } catch (error) {
      setMessage('Error: Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-ftc-gray-50 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Files To:</h2>

        {/* Email Input */}
        <div className="mb-8 max-w-2xl">
          <Input
            type="email"
            placeholder="enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-lg"
          />
        </div>

        {/* PDF Selection Grid */}
        {product.pdfContent && product.pdfContent.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-6">
              {product.pdfContent.map((pdf) => (
                <div key={pdf._id} className="flex flex-col items-center">
                  <div className="w-24 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3 relative">
                    <FileText className="w-12 h-12 text-gray-400" />
                    {selectedPdfs.includes(pdf._id) && (
                      <div className="absolute inset-0 bg-ftc-blue/20 rounded-lg"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 text-center mb-2 line-clamp-2">
                    {pdf.title}
                  </p>
                  <Checkbox
                    checked={selectedPdfs.includes(pdf._id)}
                    onChange={() => handlePdfToggle(pdf._id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          <Button
            size="lg"
            onClick={handleSendEmail}
            disabled={isSending || !email || selectedPdfs.length === 0}
          >
            {isSending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send'
            )}
          </Button>

          <Button size="lg" variant="secondary">
            send reminder
          </Button>

          {message && (
            <p
              className={`ml-4 text-sm ${
                message.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
