"use client"

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

import { IconArrowDownLeft, IconArrowRight, IconGenderFemale, IconGenderMale, IconCalendarFilled, IconChevronDown } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link';

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const GENDER_OPTIONS = [
  { value: "male", label: "Laki-laki", icon: IconGenderMale },
  { value: "female", label: "Perempuan", icon: IconGenderFemale },
] as const

interface ChipOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ChipRadioGroupProps {
  options: ChipOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function ChipRadioGroup({
  options,
  defaultValue,
  onChange,
}: ChipRadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue ?? options[0]?.value);

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-2">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg pl-2 pr-3 py-1.5 transition-all duration-200',
              'border para-sm-medium',
              isSelected
                ? 'border-accent bg-accent text-foreground'
                : 'border-primary-foreground/50 bg-transparent text-primary-foreground/80 hover:border-accent hover:bg-accent/15 hover:text-primary-foreground'
            )}
          >
            {option.icon && (
              <span className={cn(
                'transition-colors duration-200',
                isSelected
                  ? 'text-foreground'
                  : 'text-primary-foreground/80'
              )}>
                {option.icon}
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function DatePickerInput() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>()

  return (
    <Field className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            size="lg"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-full px-2 rounded-lg justify-between text-left para-sm"
          >
            {date ? formatDate(date) : <span>Pilih tanggal lahir</span>}
            <IconCalendarFilled className="size-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            defaultMonth={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}

export function HeroForm() {
  return (
    <Card className="relative flex flex-col grow justify-end w-md rounded-2xl bg-primary p-10">
      <div className="absolute top-8 right-8 grid size-12 place-items-center rounded-full bg-muted/50">
        <IconArrowDownLeft className="size-8 text-foreground" stroke={2} />
      </div>
      <CardContent className="flex flex-col p-0 gap-10">
        <h2 className="heading-2 text-primary-foreground">
          Tes gratis di sini
        </h2>
        <form className="flex flex-col gap-10">
          <FieldGroup className="gap-6">
            <Field>
              <Input
                id="name"
                name="name"
                placeholder="Masukkan nama kamu"
                autoComplete="given-name"
                className="h-10 rounded-lg bg-background border-border px-4"
              />
            </Field>

            <DatePickerInput />

            <Field>
              <ChipRadioGroup
                options={[
                  { label: 'Laki-laki', value: 'male', icon: <IconGenderMale className="size-5" /> },
                  { label: 'Perempuan', value: 'female', icon: <IconGenderFemale className="size-5" /> },
                ]}
                defaultValue="male"
                onChange={(value) => console.log(value)}
              />
            </Field>

          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-full bg-linear-to-r from-purple-600 to-indigo-500 text-white btn-text hover:from-purple-700 hover:to-indigo-600 border-0 transition-colors duration-200"
          >
            <span className='btn-text'>Mulai Tes</span>
          </Button>

          <div className="flex flex-row items-center justify-center -mt-4 text-sm text-primary-foreground/70">
            <p>Sudah punya akun?</p>
            <Button asChild variant="link" className="para-sm-medium text-primary-foreground px-2">
              <Link href="#login">Login</Link>
            </Button>
          </div>

        </form>
      </CardContent>

    </Card>
  )
}
