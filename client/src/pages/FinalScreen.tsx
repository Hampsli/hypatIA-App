import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowLeft, User, Mail, Lock, Briefcase, Calendar } from 'lucide-react';
import { Select } from '@/components/ui/Select';


export default function FinalScreen() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');




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