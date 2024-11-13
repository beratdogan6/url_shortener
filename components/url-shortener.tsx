"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from "./ui/table";
import ClickToCopy from "./click-to-copy";

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
      <div className="flex justify-center items-center gap-3">
        <Input
          type="text"
          placeholder="Enter your link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-96 bg-white"
        />
        <Button onClick={shortenUrl} className="ml-2">
          Shorten Link
        </Button>
      </div>
      {urlList.length > 0 && (
        <div className="mt-5 max-h-[350px] overflow-y-auto no-scrollbar bg-white rounded-lg border border-gray-300">
          <Table className="border border-gray-300">
            <TableHeader>
              <TableRow className="border-b border-gray-300">
                <TableHead key="original-url-head" className="text-black text-center border-r border-gray-300">
                  Original URL
                </TableHead>
                <TableHead key="short-url-head" className="text-black text-center">
                  Shortened URL
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urlList.map((entry) => (
                <TableRow key={entry.id} className="border-b border-gray-300">
                  <TableCell
                    key={`${entry.id}-original`}
                    className="max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis border-r border-gray-300"
                  >
                    <a href={entry.originalUrl} target="_blank" rel="noopener noreferrer">
                      {entry.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell key={`${entry.id}-short`}>
                    <ClickToCopy text={entry.shortUrl} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
