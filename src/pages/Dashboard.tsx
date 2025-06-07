
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText, Download, Copy, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'sonner';
import Header from '../components/Header';

interface Resume {
  id: string;
  title: string;
  lastModified: string;
  status: 'draft' | 'completed';
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      title: 'Software Engineer Resume',
      lastModified: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Product Manager Resume',
      lastModified: '2024-01-10',
      status: 'draft'
    }
  ]);
  
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const createResume = () => {
    if (!newResumeTitle.trim()) return;
    
    const newResume: Resume = {
      id: Date.now().toString(),
      title: newResumeTitle,
      lastModified: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    
    setResumes([newResume, ...resumes]);
    setNewResumeTitle('');
    setDialogOpen(false);
    toast.success('Resume created successfully!');
  };

  const duplicateResume = (resume: Resume) => {
    const duplicated: Resume = {
      ...resume,
      id: Date.now().toString(),
      title: `${resume.title} (Copy)`,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setResumes([duplicated, ...resumes]);
    toast.success('Resume duplicated successfully!');
  };

  const deleteResume = (id: string) => {
    setResumes(resumes.filter(r => r.id !== id));
    toast.success('Resume deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <p className="text-muted-foreground">Manage and create your professional resumes</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
                <DialogDescription>
                  Give your resume a title to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="e.g., Software Engineer Resume"
                  />
                </div>
                <Button onClick={createResume} className="w-full">
                  Create Resume
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resume.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {resume.status}
                  </span>
                </div>
                <CardTitle className="text-lg">{resume.title}</CardTitle>
                <CardDescription>
                  Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Button asChild className="w-full">
                    <Link to={`/resume/${resume.id}`}>
                      Edit Resume
                    </Link>
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => duplicateResume(resume)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteResume(resume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-4">Create your first resume to get started</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Resume</DialogTitle>
                  <DialogDescription>
                    Give your resume a title to get started
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Resume Title</Label>
                    <Input
                      id="title"
                      value={newResumeTitle}
                      onChange={(e) => setNewResumeTitle(e.target.value)}
                      placeholder="e.g., Software Engineer Resume"
                    />
                  </div>
                  <Button onClick={createResume} className="w-full">
                    Create Resume
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
