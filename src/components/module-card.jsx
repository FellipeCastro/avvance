import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";

export default function ModuleCard({ module }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Card
          key={module.title}
          className={
            "cursor-pointer text-left gap-2 transition duration-200 hover:border-purple-400 hover:translate-y-[-0.25rem]"
          }
        >
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <module.icon className="text-purple-500" size={24} />
            </div>
            <CardTitle>{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {module.shortDescription}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{module.title}</DialogTitle>
          <DialogDescription>{module.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
