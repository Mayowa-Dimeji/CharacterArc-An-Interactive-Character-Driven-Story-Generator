/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema } from "../validation";
import type { z } from "zod";
import { Button, Card, Input, Label, Textarea } from "../components/UI";
import { useCharacter } from "../CharacterContext"; // or "../useCharacter" if split
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type FormValues = z.infer<typeof characterSchema>;

function splitCSV(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function CreateCharacter() {
  const { character, setCharacter, reset } = useCharacter();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // 👇 keep resolver + generic in sync with the SAME schema
    resolver: zodResolver(characterSchema) as any,
    defaultValues: character ?? {
      id: uuid(),
      name: "",
      archetype: "",
      traits: [],
      goals: [{ id: uuid(), text: "", priority: 3 }],
      fears: [{ id: uuid(), text: "", intensity: 0.5 }],
      relationships: [], // present (matches schema default)
      worldview: "",
      growth_theme: "",
      history: [], // present (matches schema default)
    },
  });

  useEffect(() => {
    // optional prefill
    // setValue("name", "Aria");
    // setValue("archetype", "Reluctant Hero");
    // setValue("traits", ["brave", "curious"], { shouldValidate: true });
  }, [setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.traits?.length) {
      alert("Please add at least one trait (comma-separated).");
      return;
    }
    setCharacter(data);
    navigate("/play");
  };

  const loadSample = () => {
    const sample: FormValues = {
      id: uuid(),
      name: "Aria",
      archetype: "Reluctant Hero",
      traits: ["curious", "loyal"],
      goals: [{ id: uuid(), text: "Protect my village", priority: 5 }],
      fears: [{ id: uuid(), text: "Failing those I love", intensity: 0.7 }],
      relationships: [],
      worldview: "People are good but fragile.",
      growth_theme: "from doubt to courage",
      history: [],
    };
    (
      Object.entries(sample) as [
        keyof FormValues,
        FormValues[keyof FormValues]
      ][]
    ).forEach(([k, v]) => setValue(k, v as any, { shouldValidate: true }));
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create your character</h1>
        <div className="flex gap-2">
          <Button type="button" onClick={loadSample}>
            Load sample
          </Button>
          <Button
            type="button"
            className="bg-white text-black border"
            onClick={() => {
              reset();
              window.location.reload();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Card>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit as any)}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Aria" {...register("name")} />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="archetype">Archetype</Label>
              <Input
                id="archetype"
                placeholder="Reluctant Hero, Trickster, Sage..."
                {...register("archetype")}
              />
              {errors.archetype && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.archetype.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Traits (comma-separated)</Label>
            <Input
              placeholder="brave, curious"
              onChange={(e) => {
                const arr = splitCSV(e.target.value);
                setValue("traits", arr, { shouldValidate: true });
              }}
              defaultValue={(character?.traits ?? []).join(", ")}
            />
            {errors.traits && (
              <p className="text-red-600 text-sm mt-1">
                {String(errors.traits.message)}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Primary Goal</Label>
              <Input
                placeholder="Protect my village"
                {...register("goals.0.text")}
              />
              {errors.goals?.[0]?.text && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.goals[0].text?.message}
                </p>
              )}
              <div className="mt-2">
                <Label>Priority (1–5)</Label>
                <Input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  {...register("goals.0.priority", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <Label>Primary Fear</Label>
              <Input
                placeholder="Failing those I love"
                {...register("fears.0.text")}
              />
              {errors.fears?.[0]?.text && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fears[0].text?.message}
                </p>
              )}
              <div className="mt-2">
                <Label>Intensity (0–1)</Label>
                <Input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  {...register("fears.0.intensity", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Worldview</Label>
            <Textarea
              rows={3}
              placeholder="How does your character see the world?"
              {...register("worldview")}
            />
            {errors.worldview && (
              <p className="text-red-600 text-sm mt-1">
                {errors.worldview.message}
              </p>
            )}
          </div>

          <div>
            <Label>Growth Theme</Label>
            <Input
              placeholder="from doubt to courage"
              {...register("growth_theme")}
            />
            {errors.growth_theme && (
              <p className="text-red-600 text-sm mt-1">
                {errors.growth_theme.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
