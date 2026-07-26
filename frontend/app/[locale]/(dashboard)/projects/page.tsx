import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/pocketbase/server";
import { Project } from "@/interfaces/project";

export default async function Projects() {
  const t = await getTranslations("Projects");

  let projects: Project[] = [];

  try {
    const pb = await createServerClient();

    const records = await pb.collection("projects").getFullList({
      sort: "name",
    });

    projects = records.map((record) => ({
      id: record.id,
      name: record.name,
    }));
  } catch (error) {
    console.error(error);
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold">Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </Card>
  );
}
