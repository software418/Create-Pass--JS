import { useState } from "react";
import { Button } from "../shared/ui/atoms/Button";
import { Input } from "../shared/ui/atoms/Input";
import { Label } from "../shared/ui/atoms/Label";
import { Checkbox } from "../shared/ui/atoms/Checkbox";
import { Spinner } from "../shared/ui/atoms/Spinner";
import { Typography } from "../shared/ui/atoms/Typography";
import { Avatar } from "../shared/ui/atoms/Avatar";
import { Badge } from "../shared/ui/atoms/Badge";
import { FormField } from "../shared/ui/molecules/FormField";
import { PasswordField } from "../shared/ui/molecules/PasswordField";
import { SearchInput } from "../shared/ui/molecules/SearchInput";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../shared/ui/molecules/Card";
import { Alert } from "../shared/ui/molecules/Alert";
import { Modal } from "../shared/ui/organisms/Modal";
const KitchenSinkPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="ks-page">
      {
        <div>
          {<Typography variant="h1">Kitchen Sink (UI Components)</Typography>}
          {
            <Typography variant="muted" className="ks-subtitle">
              A comprehensive preview of all universal UI components built from
              scratch.
            </Typography>
          }
        </div>
      }
      {
        <section className="ks-section">
          {<Typography variant="h2">Atoms</Typography>}
          {
            <div className="ks-group">
              {<Typography variant="h4">Buttons</Typography>}
              {
                <div className="ks-flex-wrap">
                  {<Button variant="primary">Primary</Button>}
                  {<Button variant="secondary">Secondary</Button>}
                  {<Button variant="outline">Outline</Button>}
                  {<Button variant="danger">Danger</Button>}
                  {<Button variant="ghost">Ghost</Button>}
                  {
                    <Button variant="primary" isLoading={true}>
                      Loading
                    </Button>
                  }
                </div>
              }
            </div>
          }
          {
            <div className="ks-group-pt">
              {<Typography variant="h4">Badges & Avatars</Typography>}
              {
                <div className="ks-flex-wrap">
                  {<Badge variant="default">Default</Badge>}
                  {<Badge variant="secondary">Secondary</Badge>}
                  {<Badge variant="destructive">Destructive</Badge>}
                  {<Badge variant="outline">Outline</Badge>}
                  {
                    <div className="ks-avatar-group">
                      {<Avatar fallback="JD" size="sm" />}
                      {<Avatar fallback="JD" size="md" />}
                      {<Avatar fallback="JD" size="lg" />}
                    </div>
                  }
                </div>
              }
            </div>
          }
          {
            <div className="ks-group-pt">
              {<Typography variant="h4">Loaders</Typography>}
              {
                <div className="ks-flex">
                  {<Spinner size="sm" />}
                  {<Spinner size="md" />}
                  {<Spinner size="lg" />}
                </div>
              }
            </div>
          }
        </section>
      }
      {
        <section className="ks-section">
          {<Typography variant="h2">Molecules</Typography>}
          {
            <div className="ks-grid-2">
              {
                <div className="ks-group">
                  {<Typography variant="h4">Form Elements</Typography>}
                  {
                    <FormField label="Email Address">
                      {<Input type="email" placeholder="john@example.com" />}
                    </FormField>
                  }
                  {
                    <FormField
                      label="Password"
                      error="Password must be at least 8 characters"
                    >
                      {
                        <PasswordField
                          placeholder="Enter password"
                          error={true}
                        />
                      }
                    </FormField>
                  }
                  {
                    <div className="ks-checkbox-group">
                      {<Checkbox id="terms" />}
                      {
                        <Label htmlFor="terms">
                          Accept terms and conditions
                        </Label>
                      }
                    </div>
                  }
                  {
                    <div className="ks-search-group">
                      {<Label className="ks-search-label">Search Input</Label>}
                      {<SearchInput />}
                    </div>
                  }
                </div>
              }
              {
                <div className="ks-group">
                  {<Typography variant="h4">Alerts</Typography>}
                  {
                    <Alert variant="default" title="Info Alert">
                      This is a default informational alert.
                    </Alert>
                  }
                  {
                    <Alert variant="success" title="Success">
                      Your action was completed successfully.
                    </Alert>
                  }
                  {
                    <Alert variant="warning" title="Warning">
                      Please be careful before proceeding.
                    </Alert>
                  }
                  {
                    <Alert variant="destructive" title="Error">
                      Something went horribly wrong.
                    </Alert>
                  }
                </div>
              }
            </div>
          }
          {
            <div className="ks-card-container">
              {
                <Typography variant="h4" className="mb-4">
                  Cards
                </Typography>
              }
              {
                <Card className="ks-card">
                  {
                    <CardHeader>
                      {<CardTitle>Create project</CardTitle>}
                      {
                        <CardDescription>
                          Deploy your new project in one-click.
                        </CardDescription>
                      }
                    </CardHeader>
                  }
                  {
                    <CardContent>
                      {
                        <FormField label="Name" className="mb-4">
                          {<Input placeholder="Next.js App" />}
                        </FormField>
                      }
                    </CardContent>
                  }
                  {
                    <CardFooter className="flex justify-between">
                      {<Button variant="outline">Cancel</Button>}
                      {<Button>Deploy</Button>}
                    </CardFooter>
                  }
                </Card>
              }
            </div>
          }
        </section>
      }
      {
        <section className="space-y-6">
          {<Typography variant="h2">Organisms</Typography>}
          {
            <div className="ks-group">
              {<Typography variant="h4">Modals</Typography>}
              {<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>}
              {
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Confirm Action"
                >
                  {
                    <div className="ks-modal-text">
                      Are you sure you want to completely delete this account?
                      This action cannot be undone.
                    </div>
                  }
                  {
                    <div className="ks-modal-actions">
                      {
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Cancel
                        </Button>
                      }
                      {
                        <Button
                          variant="danger"
                          onClick={() => setIsModalOpen(false)}
                        >
                          Delete Account
                        </Button>
                      }
                    </div>
                  }
                </Modal>
              }
            </div>
          }
        </section>
      }
    </div>
  );
};
export default KitchenSinkPage;
