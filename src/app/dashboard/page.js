import { currentUser } from "@clerk/nextjs/server";

import { modules } from "@/config/modules";
import ModuleCard from "@/components/module-card";
import { Mail } from "lucide-react";

export default async function Page() {
    const user = await currentUser();

    if (!user) {
        return <h1>Você não tem permissão para acessar esta página.</h1>;
    }

    return (
        <>
            <div className="grid gap-4">
                <h1 className="flex items-center gap-3 text-3xl font-bold">
                    👋 Olá, {user.firstName || "Usuário"}!
                </h1>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={15} /> {user.emailAddresses[0].emailAddress}
                </p>
            </div>
            <p className="text-muted-foreground">
                Estamos aqui para ajudar você a dar o próximo passo na sua
                carreira — explore as ferramentas disponíveis!
            </p>

            <section className="grid gap-6 mt-3">
                <h2 className="flex items-center gap-2 text-lg font-medium">
                    <span>✨</span> Que tal explorar novas funcionalidades?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.map((module) => (
                        <ModuleCard key={module.title} module={module} />
                    ))}
                </div>
            </section>

            {/* <section className="grid gap-6 mt-3">
                <h2 className="flex items-center gap-2 text-lg font-medium">
                    <span>🛠️</span> Em breve!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.map((module, index) => (
                        <Card key={index}>
                            <CardHeader className="space-y-1">
                                <module.icon size={18} color="blue" />
                                <CardTitle>{module.title}</CardTitle>
                                <CardDescription>
                                    {module.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section> */}
        </>
    );
}
