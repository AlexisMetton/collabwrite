import { useState } from "react"
import { User, Mail, Calendar, Shield, Save, X, Edit, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // TODO: Remplacer par les vraies données
  const [name, setName] = useState("Jean Dupont")
  const [email, setEmail] = useState("jean.dupont@exemple.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const role = "Utilisateur"
  const joinDate = "15 janvier 2024"

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implémenter la logique de mise à jour du profil
    console.log("Update profile:", { name, email, currentPassword, newPassword, confirmPassword })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handle2FAToggle = () => {
    // TODO: Implémenter la logique d'activation/désactivation du 2FA
    if (is2FAEnabled) {
      // Désactiver le 2FA
      if (confirm("Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?")) {
        setIs2FAEnabled(false)
        alert("Authentification à deux facteurs désactivée")
      }
    } else {
      // Activer le 2FA
      alert("Fonctionnalité d'activation du 2FA à implémenter")
      setIs2FAEnabled(true)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">
              {isEditing ? "Modifiez vos informations personnelles" : "Gérez vos informations personnelles"}
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                {isEditing ? "Mettez à jour vos informations" : "Vos informations personnelles"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nom complet</p>
                      <p className="font-medium">{name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rôle</p>
                      <p className="font-medium">{role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membre depuis</p>
                      <p className="font-medium">{joinDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Renforcez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Authentification à deux facteurs (2FA)</p>
                      <p className="text-sm text-muted-foreground">
                        {is2FAEnabled
                          ? "L'authentification à deux facteurs est activée"
                          : "Ajoutez une couche de sécurité supplémentaire à votre compte"}
                      </p>
                      {is2FAEnabled && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                          <ShieldCheck className="h-3 w-3" />
                          Activé
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={is2FAEnabled ? "outline" : "default"}
                    size="sm"
                    onClick={handle2FAToggle}
                  >
                    {is2FAEnabled ? "Désactiver" : "Activer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Laissez vide si vous ne souhaitez pas changer votre mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {newPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-destructive">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {isEditing && (
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={newPassword !== "" && newPassword !== confirmPassword}
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
