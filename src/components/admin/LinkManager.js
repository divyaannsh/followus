"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit2 } from "lucide-react"

export default function LinkManager() {
  const [links, setLinks] = useState([])
  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links")
      const data = await res.json()
      if (res.ok) {
        setLinks(data.links)
      }
    } catch (error) {
      console.error("Error fetching links:", error)
    } finally {
      setLoading(false)
    }
  }
  

  const addLink = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLink),
      })

      if (res.ok) {
        setNewLink({ title: "", url: "" })
        fetchLinks()
      }
    } catch (error) {
      console.error("Error adding link:", error)
    }
  }

  

  const deleteLink = async (linkId) => {
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchLinks()
      }
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Links</h2>

      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={addLink} className="flex gap-4">
            <Input
              placeholder="Link Title"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              required
            />
            <Input
              placeholder="URL"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              required
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <p>Loading links...</p>
        ) : (
          links.map((link) => (
            <Card key={link._id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteLink(link._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

