import { useState } from 'react';
import { carApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const brands = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford', 'Tesla'];

export function CarChat() {
  const [message, setMessage] = useState('');
  const [brand, setBrand] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !brand) {
      toast({
        title: 'Error',
        description: 'Please enter a message and select a brand',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await carApi.askQuestion(message, brand);
      setResponse(result.reply);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Car AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Select a car brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything about your selected car brand..."
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Asking...' : 'Ask'}
            </Button>
          </div>

          {response && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 