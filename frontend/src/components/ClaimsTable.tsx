import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useClaims } from '@/hooks/useClaims';
import {
  AlertCircle,
  Calendar,
  MapPin,
  Car,
  User,
  FileText,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const ClaimsTable = () => {
  const { data, isLoading, error } = useClaims(10);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const toggleDescription = (claimId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(claimId)) {
      newExpanded.delete(claimId);
    } else {
      newExpanded.add(claimId);
    }
    setExpandedDescriptions(newExpanded);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gespeicherte Schadensmeldungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Lade Schadensmeldungen...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gespeicherte Schadensmeldungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-destructive">
              <AlertCircle className="w-12 h-12" />
              <p>Fehler beim Laden der Schadensmeldungen</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const claims = data?.claims || [];

  if (claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gespeicherte Schadensmeldungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4 text-muted-foreground">
              <FileText className="w-12 h-12" />
              <p>Noch keine Schadensmeldungen vorhanden</p>
              <p className="text-sm">Schadensmeldungen erscheinen hier nach der Analyse</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gespeicherte Schadensmeldungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claims.map((claim) => {
            const isExpanded = expandedDescriptions.has(claim.claim_id);

            return (
              <Card key={claim.claim_id} className="bg-muted/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Kunde</span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {claim.customer_name}
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                          <Car className="w-4 h-4" />
                          <span>Fahrzeug</span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {claim.license_plate || 'Nicht angegeben'}
                        </div>
                        <div className="text-sm text-foreground">
                          Fahrer: {claim.driver_name || 'Nicht angegeben'}
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                      {/* Incident Date & Location */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Unfalldatum & Ort</span>
                        </div>
                        <div className="font-semibold text-foreground">
                          {claim.incident_date && claim.incident_time
                            ? `${claim.incident_date} um ${claim.incident_time} Uhr`
                            : claim.incident_date
                            ? claim.incident_date
                            : 'Nicht angegeben'}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{claim.location}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Status</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            claim.status === 'submitted' ? 'default' :
                            claim.status === 'forwarded' ? 'secondary' :
                            claim.status === 'approved' ? 'outline' : 'destructive'
                          }>
                            {claim.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Incident & Damage - Collapsible (spans both columns) */}
                    <div className="space-y-2 md:col-span-2">
                      <button
                        onClick={() => toggleDescription(claim.claim_id)}
                        className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <FileText className="w-4 h-4" />
                        <span>Hergang & Schaden</span>
                      </button>

                      {isExpanded && (
                        <div className="space-y-3 pt-2 animate-in slide-in-from-top-2">
                          {claim.description && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">Unfallhergang:</p>
                              <p className="text-sm text-foreground pl-2 border-l-2 border-muted-foreground/30">
                                {claim.description}
                              </p>
                            </div>
                          )}

                          {claim.damage_description && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">Schadensbeschreibung:</p>
                              <p className="text-sm text-foreground pl-2 border-l-2 border-muted-foreground/30">
                                {claim.damage_description}
                              </p>
                            </div>
                          )}

                          {(claim.injuries !== undefined && claim.injuries !== null) && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">Personenschäden:</p>
                              <p className="text-sm text-foreground pl-2 border-l-2 border-muted-foreground/30">
                                {typeof claim.injuries === 'string'
                                  ? claim.injuries
                                  : typeof claim.injuries === 'number'
                                  ? claim.injuries === 0
                                    ? 'Keine Personen verletzt'
                                    : `${claim.injuries} Person${claim.injuries !== 1 ? 'en' : ''} verletzt`
                                  : 'Personenschaden gemeldet'}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with metadata */}
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      Erstellt {formatDistanceToNow(new Date(claim.created_at), { addSuffix: true, locale: de })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsTable;
