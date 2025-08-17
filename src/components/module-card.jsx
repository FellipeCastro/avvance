import Link from "next/link";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";

export default function ModuleCard({ module }) {
    return (
        <Card key={module.title}>
            <CardHeader className="space-y-1">
                <span className="text-blue-500">
                    <module.icon size={18} />
                </span>
                <CardTitle>{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{module.shortDescription}</CardDescription>
            </CardContent>
            <CardFooter className="flex gap-3 items-center mt-auto">
                <Button variant="outline">
                    <Link href={module.url}>Acessar</Link>
                </Button>
                <Badge variant="secondary" className="text-muted-foreground">{module.category}</Badge>
            </CardFooter>
        </Card>
    );
}
