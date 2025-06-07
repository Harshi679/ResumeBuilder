
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Save, Bot, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Header from '../components/Header';
import AIAssistant from '../components/AIAssistant';
import { toast } from 'sonner';

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications';
  title: string;
  content: any;
}

const ResumeBuilder = () => {
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: 'personal',
      type: 'personal',
      title: 'Personal Information',
      content: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with 5+ years in full-stack development...'
      }
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      content: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          duration: '2022 - Present',
          description: 'Led development of web applications using React and Node.js...'
        }
      ]
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      content: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Computer Science',
          duration: '2018 - 2022',
          gpa: '3.8/4.0'
        }
      ]
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      content: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS']
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      content: [
        {
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React and Express...',
          technologies: ['React', 'Node.js', 'MongoDB']
        }
      ]
    },
    {
      id: 'certifications',
      type: 'certifications',
      title: 'Certifications',
      content: [
        {
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023'
        }
      ]
    }
  ]);

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const updateSectionContent = (sectionId: string, newContent: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, content: newContent }
        : section
    ));
  };

  const saveResume = () => {
    // Here you would save to your backend
    toast.success('Resume saved successfully!');
  };

  const exportPDF = () => {
    // Here you would generate and download PDF
    toast.success('PDF export started!');
  };

  const renderSectionContent = (section: ResumeSection) => {
    switch (section.type) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={section.content.name} 
                  onChange={(e) => updateSectionContent(section.id, {...section.content, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={section.content.email}
                  onChange={(e) => updateSectionContent(section.id, {...section.content, email: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={section.content.phone}
                  onChange={(e) => updateSectionContent(section.id, {...section.content, phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input 
                  value={section.content.location}
                  onChange={(e) => updateSectionContent(section.id, {...section.content, location: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Professional Summary</Label>
              <Textarea 
                value={section.content.summary}
                onChange={(e) => updateSectionContent(section.id, {...section.content, summary: e.target.value})}
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {section.content.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <Input 
              placeholder="Add new skill (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    updateSectionContent(section.id, [...section.content, input.value.trim()]);
                    input.value = '';
                  }
                }
              }}
            />
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {section.content.map((exp: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input value={exp.company} />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={exp.position} />
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input value={exp.duration} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={exp.description} rows={3} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm">Add Experience</Button>
          </div>
        );

      default:
        return (
          <div>
            <Textarea 
              placeholder={`Enter ${section.title.toLowerCase()} details...`}
              rows={4}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground">Drag sections to reorder them</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setAiAssistantOpen(true)}>
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="outline" onClick={saveResume}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={exportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${snapshot.isDragging ? 'shadow-lg rotate-2' : ''} transition-all`}
                          >
                            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                              <div {...provided.dragHandleProps} className="mr-3 cursor-grab">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {renderSectionContent(section)}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg min-h-full">
                  <div className="space-y-6">
                    {sections.map((section) => (
                      <div key={section.id} className="border-b pb-4 last:border-b-0">
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                          {section.title}
                        </h3>
                        {section.type === 'personal' && (
                          <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {section.content.name}
                            </h2>
                            <div className="text-gray-600 dark:text-gray-300">
                              {section.content.email} • {section.content.phone} • {section.content.location}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-3">
                              {section.content.summary}
                            </p>
                          </div>
                        )}
                        {section.type === 'skills' && (
                          <div className="flex flex-wrap gap-2">
                            {section.content.map((skill: string, index: number) => (
                              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {section.type === 'experience' && (
                          <div className="space-y-4">
                            {section.content.map((exp: any, index: number) => (
                              <div key={index}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{exp.position}</h4>
                                    <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                                  </div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIAssistant 
        open={aiAssistantOpen} 
        onOpenChange={setAiAssistantOpen}
        onContentSuggestion={(content) => {
          // Handle AI content suggestions
          toast.success('AI suggestion applied!');
        }}
      />
    </div>
  );
};

export default ResumeBuilder;
