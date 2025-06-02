"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface WeatherData {
  description: string;
  temperature: number;
  city: string;
  icon?: string;
}

export function AttendeeDataTable<TData extends { attendance_id: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError(null);
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
      const city = "Davao City";
      const units = "metric";

      if (!apiKey) {
        console.error("Weather API key is missing. Please set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file.");
        setWeatherError("Weather service not configured.");
        setIsLoadingWeather(false);
        return;
      }

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        const data = await response.json();
        setWeather({
          description: data.weather[0].description,
          temperature: Math.round(data.main.temp),
          city: data.name,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        if (error instanceof Error) {
          setWeatherError(`Could not load weather: ${error.message}`);
        } else {
          setWeatherError("Could not load weather due to an unknown error.");
        }
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  const groupedData = React.useMemo(() => {
    const groups: Record<string, TData[]> = {};
    data.forEach((item) => {
      const id = item.attendance_id;
      if (!groups[id]) groups[id] = [];
      groups[id].push(item);
    });
    return groups;
  }, [data]);

  const filteredData = selectedAttendanceId ? groupedData[selectedAttendanceId] || [] : [];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Attendee Reports
          </h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            View and Manage all Attendee submissions.
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Weather Today
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Weather in {weather?.city || "Davao City"}
          </p>
          {isLoadingWeather && <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Loading weather...</p>}
          {weatherError && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{weatherError}</p>}
          {weather && !isLoadingWeather && !weatherError && (
            <>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 capitalize">
                {weather.description}, {weather.temperature}&deg;C
              </p>
              {weather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-12 h-12 inline-block"
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by Student Name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <select
            value={selectedAttendanceId ?? ""}
            onChange={(e) => setSelectedAttendanceId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Attendance ID</option>
            {Object.keys(groupedData).map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedAttendanceId && (
        <div className="overflow-y-scroll max-h-96 rounded-md border mt-4">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link href="/attendance_dashboard" passHref>
          <Button variant="outline" className="hover:bg-emerald-500">
            &larr; Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
