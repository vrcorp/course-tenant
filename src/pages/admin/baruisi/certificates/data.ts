import certificatesJson from '@/data/certificates.json';
import { Certificate } from './types';

export const certificatesData: Certificate[] = [
  {
    id: 'cert1',
    name: 'Course Completion Certificate',
    description: 'Standard certificate for course completion',
    backgroundImage: 'https://placehold.co/800x600/f0f9ff/1e40af?text=Certificate+Template',
    width: 800,
    height: 600,
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Certificate of Completion',
        x: 400,
        y: 150,
        width: 600,
        height: 60,
        fontSize: 36,
        fontFamily: 'Arial',
        color: '#1e40af',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      {
        id: 'student-name',
        type: 'text',
        content: '{{studentName}}',
        x: 400,
        y: 250,
        width: 500,
        height: 40,
        fontSize: 28,
        fontFamily: 'Arial',
        color: '#374151',
        fontWeight: 'normal',
        textAlign: 'center'
      },
      {
        id: 'course-name',
        type: 'text',
        content: '{{courseName}}',
        x: 400,
        y: 320,
        width: 500,
        height: 30,
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#6b7280',
        fontWeight: 'normal',
        textAlign: 'center'
      },
      {
        id: 'date',
        type: 'text',
        content: '{{completionDate}}',
        x: 150,
        y: 450,
        width: 200,
        height: 25,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#374151',
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'signature',
        type: 'signature',
        content: 'Director Signature',
        x: 550,
        y: 420,
        width: 150,
        height: 80,
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#374151',
        fontWeight: 'normal',
        textAlign: 'center'
      }
    ],
    issuer: 'Videmy Academy',
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20'
  },
  {
    id: 'cert2',
    name: 'Achievement Certificate',
    description: 'Premium certificate for outstanding achievement',
    backgroundImage: 'https://placehold.co/800x600/fef3c7/d97706?text=Achievement+Certificate',
    width: 800,
    height: 600,
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Certificate of Achievement',
        x: 400,
        y: 120,
        width: 600,
        height: 50,
        fontSize: 32,
        fontFamily: 'Georgia',
        color: '#d97706',
        fontWeight: 'bold',
        textAlign: 'center'
      },
      {
        id: 'student-name',
        type: 'text',
        content: '{{studentName}}',
        x: 400,
        y: 220,
        width: 500,
        height: 35,
        fontSize: 24,
        fontFamily: 'Georgia',
        color: '#374151',
        fontWeight: 'bold',
        textAlign: 'center'
      }
    ],
    issuer: 'Videmy Institute',
    published: false,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15'
  },
];
