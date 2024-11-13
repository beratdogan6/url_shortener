"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from "./ui/table";

interface UrlEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
  date: Date;
}

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [urlList, setUrlList] = useState<UrlEntry[]>([]);

  // Tüm URL'leri çekmek için useEffect kancası
  useEffect(() => {
    const fetchUrls = async () => {
      const response = await fetch("/api/shorten", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedUrls = data.urls.map((entry: any) => ({
          id: entry.id,
          originalUrl: entry.url,
          shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${entry.id}`,
          date: new Date(entry.date),
        }));
        setUrlList(fetchedUrls);
      }
    };

    fetchUrls();
  }, []);

  // Yeni URL kısaltma işlemi
  const shortenUrl = async () => {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      const newEntry: UrlEntry = {
        id: data.id,
        originalUrl: url,
        shortUrl: data.shortUrl,
        date: new Date(),
      };
      setUrlList((prevList) => [newEntry, ...prevList]);
      setShortUrl(data.shortUrl);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5">
        <Input
          type="text"
          placeholder="Enter your link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-96 bg-white"
        />
        <Button onClick={shortenUrl} className="ml-2">
          Shorten
        </Button>
      </div>
      {shortUrl && (
        <div className="mt-2">
          Shortened URL:{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {shortUrl}
          </a>
        </div>
      )}
      {urlList.length > 0 && (
        <Table className="mt-5 bg-white bg-opacity-20 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead key="original-url-head" className="text-black">Original URL</TableHead>
              <TableHead key="short-url-head" className="text-black">Shortened URL</TableHead>
              <TableHead key="date-head" className="text-black">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urlList.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell key={`${entry.id}-original`}>
                  <a href={entry.originalUrl} target="_blank" rel="noopener noreferrer">
                    {entry.originalUrl}
                  </a>
                </TableCell>
                <TableCell key={`${entry.id}-short`}>
                  <a href={entry.shortUrl} target="_blank" rel="noopener noreferrer">
                    {entry.shortUrl}
                  </a>
                </TableCell>
                <TableCell key={`${entry.id}-date`}>{entry.date.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UrlShortener;
