import React, { useState, useEffect, useRef } from 'react';
import { Avatar, StatusBadge, RoleBadge, Button, Toast, Card, Modal, LoadingSpinner, ConfirmDialog, QRCodeGenerator } from '../../components';
import { ChatArea, Sidebar } from './index';
import { FilePreviewModal } from './DashboardScreen/components/FilePreviewModal';
import { useAuth } from '../../context/AuthContext';
import { useToast, useMapPoints } from '../../hooks';
import { playAlarm, playMessageSound } from '../../hooks/useSound';
import { dashboardService, messageService, equipoService } from '../../services';
import { COLORS, clearAuth } from '../../utils';
import { normalizeMapPoint } from '../../utils/mapHelpers';
import type { DashboardStats, ActivityItem, AwsMetrics, Conversation, Message, User, Equipo, Catalogs, Zona, MapPointInput } from '../../types';

const SimpleQRScanner: React.FC<{ onScan: (code: string) => void; onClose: () => void }> = ({ onScan, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error('Camera error:', e);
      }
    };
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <video ref={videoRef} style={{ width: '100%', maxHeight: 250, borderRadius: 8, marginBottom: 15 }} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ marginBottom: 15 }}>
        <input 
          type="text" 
          value={manualCode} 
          onChange={(e) => setManualCode(e.target.value)} 
          placeholder="Pega el código QR aquí"
          style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleManualSubmit}>Escanear</Button>
      </div>
      <p style={{ fontSize: 11, color: COLORS.gray500, marginTop: 10 }}>
        También puedes usar la cámara de tu teléfono para escanear y pegar el código aquí
      </p>
    </div>
  );
};

  const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState<'teams' | 'chats' | 'map' | 'archived'>('teams');
  const [archivedEquipos, setArchivedEquipos] = useState<Equipo[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'aws' | 'empresas'>('overview');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Equipo | null>(null);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [groupMessageText, setGroupMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [voiceMessages, setVoiceMessages] = useState<{ id: string; url: string; duration: number; esMio: boolean; timestamp: string }[]>([]);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showGroupConfigModal, setShowGroupConfigModal] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showMemberProfileModal, setShowMemberProfileModal] = useState(false);
  const [memberProfile, setMemberProfile] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pinnedGroups, setPinnedGroups] = useState<string[]>([]);
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [archivedGroups, setArchivedGroups] = useState<string[]>([]);
  const [newUserData, setNewUserData] = useState({ nombre: '', usuario: '', identidad: '', telefono: '', email: '', password: '', rol: 'guardia' });
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'success' | 'info';
    onConfirm: () => void;
  }>({ visible: false, title: '', message: '', type: 'danger', onConfirm: () => {} });
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupZone, setNewGroupZone] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchIdentity, setSearchIdentity] = useState('');
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [collapsedAdminSections, setCollapsedAdminSections] = useState<Set<string>>(new Set(['admins', 'recepcionistas', 'guardiasActivos', 'desactivados']));
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [selectedCompanyViewFilter, setSelectedCompanyViewFilter] = useState<string>('');
  const [empresas, setEmpresas] = useState<{id: string, nombre: string, direccion: string, telefono: string, fechaCreacion?: string}[]>([
    { id: 'techcorp', nombre: 'TechCorp Industries', direccion: 'Av. Industrial 1234, CDMX', telefono: '+52 55 1234 5678', fechaCreacion: '2024-01-15' },
    { id: 'mercurio', nombre: 'Grupo Mercurio', direccion: 'Blvd. Corporativo 567, Monterrey', telefono: '+52 81 8765 4321', fechaCreacion: '2024-02-20' },
  ]);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showCompanyConfigModal, setShowCompanyConfigModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<{id: string, nombre: string, direccion: string, telefono: string, fechaCreacion?: string} | null>(null);
  const [selectedCompanyView, setSelectedCompanyView] = useState<{id: string, nombre: string, direccion: string, telefono: string, fechaCreacion?: string} | null>(null);
  const [selectedCompanyUsers, setSelectedCompanyUsers] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyAddress, setNewCompanyAddress] = useState('');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [previewAsRole, setPreviewAsRole] = useState<'guardia' | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zona | null>(null);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneLocation, setNewZoneLocation] = useState('');
  const [newZoneColor, setNewZoneColor] = useState('#E74C3C');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [awsMetrics, setAwsMetrics] = useState<AwsMetrics | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ type: 'group' | 'individual'; name: string; startTime: number } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceAudioChunksRef = useRef<Blob[]>([]);
  const voiceRecordingIntervalRef = useRef<number | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [qrScannerTarget, setQrScannerTarget] = useState<'chat' | 'group' | null>(null);
  const [pendingFile, setPendingFile] = useState<{ file: File; tipo: 'imagen' | 'video' | 'archivo' | 'audio' } | null>(null);

  const [showAddMapModal, setShowAddMapModal] = useState(false);
  const [newMapPoint, setNewMapPoint] = useState<MapPointInput>({ nombre: '', lat: '', lng: '', tipo: 'Punto' });
  const { mapPoints, addMapPoint, removeMapPoint, updateMapPoint } = useMapPoints([]);

  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, groupMessages]);
  useEffect(() => {
    if (activeCall) {
      callIntervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - activeCall.startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [activeCall]);

  const loadData = async () => {
    try {
      const [statsData, activityData, metricsData, convos, equiposData, catsData] = await Promise.all<[
        ReturnType<typeof dashboardService.getStats>,
        ReturnType<typeof dashboardService.getRecentActivity>,
        ReturnType<typeof dashboardService.getAwsMetrics>,
        ReturnType<typeof messageService.getConversations>,
        ReturnType<typeof equipoService.getAll>,
        ReturnType<typeof dashboardService.getCatalogs>
      ]>([
        dashboardService.getStats(), dashboardService.getRecentActivity(), dashboardService.getAwsMetrics(),
        messageService.getConversations(), equipoService.getAll(), dashboardService.getCatalogs(),
      ]);
      setStats(statsData); setActivity(activityData); setAwsMetrics(metricsData);
      
      const mockUsers: User[] = [
        { id: 'g1', nombre: 'Carlos Mendoza', usuario: 'carlos.m', rol: 'guardia', identidad: 'ID001', telefono: '+52 55 1111 1111', estado: 'active', empresaId: 'techcorp' },
        { id: 'g2', nombre: 'Pedro Ramirez', usuario: 'pedro.r', rol: 'guardia', identidad: 'ID002', telefono: '+52 55 2222 2222', estado: 'active', empresaId: 'techcorp' },
        { id: 'g3', nombre: 'Miguel Torres', usuario: 'miguel.t', rol: 'guardia', identidad: 'ID003', telefono: '+52 55 3333 3333', estado: 'active', empresaId: 'techcorp' },
        { id: 'g4', nombre: 'Luis Garcia', usuario: 'luis.g', rol: 'guardia', identidad: 'ID004', telefono: '+52 55 4444 4444', estado: 'active', empresaId: 'mercurio' },
        { id: 'g5', nombre: 'Jose Lopez', usuario: 'jose.l', rol: 'guardia', identidad: 'ID005', telefono: '+52 55 5555 5555', estado: 'active', empresaId: 'mercurio' },
        { id: 'g6', nombre: 'Antonio Hernandez', usuario: 'antonio.h', rol: 'guardia', identidad: 'ID006', telefono: '+52 55 6666 6666', estado: 'active', empresaId: 'mercurio' },
        { id: 'g7', nombre: 'Roberto Diaz', usuario: 'roberto.d', rol: 'guardia', identidad: 'ID007', telefono: '+52 55 7777 7777', estado: 'inactive', empresaId: 'techcorp' },
        { id: 'g8', nombre: 'Francisco Martinez', usuario: 'francisco.m', rol: 'guardia', identidad: 'ID008', telefono: '+52 55 8888 8888', estado: 'active', empresaId: 'mercurio' },
        { id: 'a1', nombre: 'Admin TechCorp', usuario: 'admin.tech', rol: 'admin', identidad: 'ADM001', telefono: '+52 55 0001 0001', estado: 'active', empresaId: 'techcorp' },
        { id: 'r1', nombre: 'Recep TechCorp', usuario: 'recep.tech', rol: 'recepcion', identidad: 'REP001', telefono: '+52 55 0002 0002', estado: 'active', empresaId: 'techcorp' },
        { id: 'r2', nombre: 'Recep Mercurio', usuario: 'recep.mer', rol: 'recepcion', identidad: 'REP002', telefono: '+52 55 0003 0003', estado: 'active', empresaId: 'mercurio' },
      ];
      setUsers(mockUsers);
      
      const mockEquipos: Equipo[] = [
        { id: 'eq1', nombre: 'Equipo Nocturno A', descripcion: 'Equipo de vigilancia nocturna TechCorp', zona: catsData.zonas[0] || null, miembros: mockUsers.filter(u => u.empresaId === 'techcorp' && u.rol === 'guardia' && u.estado === 'active').slice(0, 3).map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado })), fechaCreacion: '2024-01-15', empresaId: 'techcorp' },
        { id: 'eq2', nombre: 'Equipo Diurno A', descripcion: 'Equipo de vigilancia diurna TechCorp', zona: catsData.zonas[1] || null, miembros: mockUsers.filter(u => u.empresaId === 'techcorp' && u.rol === 'guardia' && u.estado === 'active').slice(1, 3).map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado })), fechaCreacion: '2024-02-01', empresaId: 'techcorp' },
        { id: 'eq3', nombre: 'Equipo Nocturno B', descripcion: 'Equipo de vigilancia nocturna Mercurio', zona: catsData.zonas[0] || null, miembros: mockUsers.filter(u => u.empresaId === 'mercurio' && u.rol === 'guardia' && u.estado === 'active').slice(0, 3).map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado })), fechaCreacion: '2024-02-10', empresaId: 'mercurio' },
        { id: 'eq4', nombre: 'Equipo Diurno B', descripcion: 'Equipo de vigilancia diurna Mercurio', zona: catsData.zonas[1] || null, miembros: mockUsers.filter(u => u.empresaId === 'mercurio' && u.rol === 'guardia' && u.estado === 'active').slice(1, 3).map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado })), fechaCreacion: '2024-02-15', empresaId: 'mercurio' },
      ];
      setEquipos(equiposData.length > 0 ? equiposData : mockEquipos);
      setConversations(convos.length > 0 ? convos : mockUsers.filter(u => u.rol === 'guardia').map(u => ({ usuarioId: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado, ultimoMensaje: 'Sin mensajes', timestamp: new Date().toISOString(), noLeidos: 0 })));
      setCatalogs(catsData);
      addMapPoint({ id: 'map1', nombre: 'Entrada Principal', lat: 19.4326, lng: -99.1332, tipo: 'Punto' });
      addMapPoint({ id: 'map2', nombre: 'Zona C', lat: 19.4390, lng: -99.1320, tipo: 'Ruta' });
    } catch { showToast('Error al cargar datos', 'error'); } finally { setLoading(false); }
  };

  const handleSelectChat = async (convo: Conversation) => {
    setSelectedChat(convo);
    setSelectedGroup(null);
    try { const msgs = await messageService.getMessages(convo.usuarioId); setMessages(msgs); playMessageSound(); }
    catch { showToast('Error al cargar mensajes', 'error'); }
  };

  const handleSelectGroup = async (grupo: Equipo) => {
    setSelectedGroup(grupo);
    setSelectedChat(null);
    setGroupMembersHistory([]);
    setGroupMessages([
      { id: '1', contenido: `Bienvenidos al grupo ${grupo.nombre}`, timestamp: new Date(Date.now() - 3600000).toISOString(), leido: true, esMio: false },
      { id: '2', contenido: 'Grupo creado exitosamente', timestamp: new Date(Date.now() - 1800000).toISOString(), leido: true, esMio: false },
    ]);
    playMessageSound();
    showToast(`Chat de ${grupo.nombre} abierto`, 'info');
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    if (selectedChat) {
      try { const newMsg = await messageService.send(selectedChat.usuarioId, messageText); setMessages(prev => [...prev, newMsg]); setMessageText(''); }
      catch { showToast('Error al enviar mensaje', 'error'); }
    }
  };

  const handleSendGroupMessage = () => {
    if (!groupMessageText.trim() || !selectedGroup) return;
    const newMsg: Message = { id: Date.now().toString(), contenido: groupMessageText, timestamp: new Date().toISOString(), leido: true, esMio: true, grupoId: selectedGroup.id, emisorNombre: user?.nombre || 'Yo' };
    setGroupMessages(prev => [...prev, newMsg]);
    setGroupMessageText('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile({ file, tipo: 'imagen' });
    }
    setShowFileMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile({ file, tipo: 'archivo' });
    }
    setShowFileMenu(false);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile({ file, tipo: 'video' });
    }
    setShowFileMenu(false);
  };

  const handleConfirmFileSend = () => {
    if (!pendingFile) return;
    const { file, tipo } = pendingFile;
    const reader = new FileReader();
    reader.onload = () => {
      const newMsg: Message = {
        id: Date.now().toString(),
        contenido: reader.result as string,
        timestamp: new Date().toISOString(),
        leido: true,
        esMio: true,
        tipo,
        archivoNombre: file.name,
        grupoId: selectedGroup?.id
      };
      if (selectedGroup) {
        setGroupMessages(prev => [...prev, newMsg]);
      } else if (selectedChat) {
        setMessages(prev => [...prev, newMsg]);
      }
      const tipoLabel = tipo === 'imagen' ? 'Imagen' : tipo === 'video' ? 'Video' : tipo === 'audio' ? 'Audio' : 'Archivo';
      showToast(`${tipoLabel} enviado`, 'success');
    };
    reader.readAsDataURL(file);
    setPendingFile(null);
  };

  const handleCancelFileSend = () => {
    setPendingFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } };

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const voiceTimerRef = useRef<number | null>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      
      const recorder = new MediaRecorder(stream, { mimeType });
      voiceAudioChunksRef.current = [];
      
      recorder.ondataavailable = (e: BlobEvent) => { 
        if (e.data.size > 0) voiceAudioChunksRef.current.push(e.data); 
      };
      
      recorder.onstop = () => {
        // Create and send the message
        if (voiceAudioChunksRef.current.length > 0) {
          const blob = new Blob(voiceAudioChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const msg: Message = { 
            id: Date.now().toString(), 
            contenido: url, 
            timestamp: new Date().toISOString(), 
            leido: true, 
            esMio: true, 
            tipo: 'audio' 
          };
          if (selectedChat) setMessages(prev => [...prev, msg]);
          else if (selectedGroup) setGroupMessages(prev => [...prev, { ...msg, grupoId: selectedGroup.id, emisorNombre: user?.nombre || 'Yo' }]);
          showToast('Audio enviado', 'success');
        }
      };
      
      voiceMediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
      setVoiceDuration(0);
      voiceTimerRef.current = window.setInterval(() => { setVoiceDuration(d => d + 1); }, 1000);
      showToast('Grabando...', 'info');
    } catch (e) { 
      console.error('Error recording:', e);
      showToast('Error al acceder al micrófono', 'error'); 
    }
  };

  const stopVoiceRecording = () => {
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state !== 'inactive') {
      voiceMediaRecorderRef.current.stop();
    }
    if (voiceTimerRef.current) { 
      clearInterval(voiceTimerRef.current); 
      voiceTimerRef.current = null; 
    }
    voiceStreamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    setIsRecording(false);
    setVoiceDuration(0);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupZone) { showToast('Completa todos los campos', 'info'); return; }
    const selectedUsers = users.filter(u => selectedMembers.includes(u.id)).map(u => ({ id: u.id, nombre: u.nombre, rol: u.rol, estado: u.estado as any }));
    setConfirmDialog({ visible: true, title: 'Crear Grupo', message: `¿Crear grupo "${newGroupName}" con ${selectedUsers.length} miembro(s)?`, type: 'success', onConfirm: () => {
      const newEquipo = { id: `equipo-${Date.now()}`, nombre: newGroupName, zona: catalogs?.zonas.find(z => z.id === newGroupZone) || null, miembros: selectedUsers, fechaCreacion: new Date().toISOString(), empresaId: user?.empresaId };
      setEquipos(prev => [...prev, newEquipo]); setShowCreateGroupModal(false); setNewGroupName(''); setNewGroupZone(''); setSelectedMembers([]);
      setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Grupo creado', 'success');
    }});
  };

  const handleDeleteGroup = (equipoId: string, equipoNombre: string) => {
    setConfirmDialog({ visible: true, title: 'Eliminar Grupo', message: `¿Eliminar "${equipoNombre}"?`, type: 'danger', onConfirm: () => {
      setEquipos(prev => prev.filter(e => e.id !== equipoId)); setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Grupo eliminado', 'success');
    }});
  };

  const handleSendAlertToGroup = () => {
    if (!selectedGroup) return;
    setConfirmDialog({ visible: true, title: 'Enviar Alerta', message: `¿Enviar alerta de emergencia a todos los ${selectedGroup.miembros.length} miembros del grupo?`, type: 'danger', onConfirm: () => {
      const alertMsg = { id: Date.now().toString(), contenido: `🚨 ALERTA DE EMERGENCIA enviada por ${user?.nombre}`, timestamp: new Date().toISOString(), leido: true, esMio: true };
      setGroupMessages(prev => [...prev, alertMsg]);
      setConfirmDialog(prev => ({ ...prev, visible: false }));
      playAlarm({ volume: 0.8 });
      showToast(`Alerta enviada a ${selectedGroup.miembros.length} miembros`, 'error');
    }});
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) { height *= maxSize / width; width = maxSize; }
          } else {
            if (height > maxSize) { width *= maxSize / height; height = maxSize; }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setPendingPhoto(compressedDataUrl);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhotoSend = () => {
    if (pendingPhoto) {
      const msg: Message = { id: Date.now().toString(), contenido: pendingPhoto, timestamp: new Date().toISOString(), leido: true, esMio: true, tipo: 'imagen' };
      if (selectedGroup) setGroupMessages(prev => [...prev, msg]);
      else setMessages(prev => [...prev, msg]);
      showToast('Foto enviada', 'success');
      setPendingPhoto(null);
    }
  };

  const cancelPhotoSend = () => {
    setPendingPhoto(null);
  };

  const handlePinMessage = (msg: Message) => {
    setPinnedMessage(prev => prev?.id === msg.id ? null : msg);
    showToast(pinnedMessage?.id === msg.id ? 'Mensaje des-fijado' : 'Mensaje fijado', 'success');
  };

  const handleRemoveMemberFromGroup = (memberId: string, memberName: string) => {
    if (!selectedGroup) return;
    setConfirmDialog({ visible: true, title: 'Eliminar Miembro', message: `¿Eliminar a ${memberName} del grupo?`, type: 'danger', onConfirm: () => {
      setEquipos(prev => prev.map(eq => eq.id === selectedGroup.id ? { ...eq, miembros: eq.miembros.filter(m => m.id !== memberId) } : eq));
      setSelectedGroup(prev => prev ? { ...prev, miembros: prev.miembros.filter(m => m.id !== memberId) } : null);
      const systemMsg: Message = {
        id: Date.now().toString(),
        contenido: `El usuario ${memberName} ha sido expulsado del grupo`,
        timestamp: new Date().toISOString(),
        leido: true,
        esMio: false,
        tipo: 'sistema',
        emisorNombre: 'Sistema'
      };
      setGroupMessages(prev => [...prev, systemMsg]);
      setConfirmDialog(prev => ({ ...prev, visible: false }));
      showToast(`${memberName} eliminado del grupo`, 'success');
    }});
  };

  const [groupMembersHistory, setGroupMembersHistory] = useState<{id: string, nombre: string, timestamp: string}[]>([]);

  const handleAddMemberToGroup = (userId: string) => {
    if (!selectedGroup) return;
    const userToAdd = users.find(u => u.id === userId);
    if (!userToAdd) return;
    
    setEquipos(prev => prev.map(eq => eq.id === selectedGroup.id ? { ...eq, miembros: [...eq.miembros, { id: userToAdd.id, nombre: userToAdd.nombre, rol: userToAdd.rol, estado: userToAdd.estado }] } : eq));
    setSelectedGroup(prev => prev ? { ...prev, miembros: [...prev.miembros, { id: userToAdd.id, nombre: userToAdd.nombre, rol: userToAdd.rol, estado: userToAdd.estado }] } : null);
    
    const newMember = { id: userToAdd.id, nombre: userToAdd.nombre, timestamp: new Date().toISOString() };
    const updatedHistory = [...groupMembersHistory, newMember];
    setGroupMembersHistory(updatedHistory);
    
    const memberNames = updatedHistory.map(m => m.nombre);
    let systemContent: string;
    if (memberNames.length === 1) {
      systemContent = `El usuario ${memberNames[0]} se ha unido al grupo`;
    } else if (memberNames.length === 2) {
      systemContent = `${memberNames[0]} y ${memberNames[1]} se han unido al grupo`;
    } else if (memberNames.length <= 4) {
      systemContent = `${memberNames.slice(0, -1).join(', ')} y ${memberNames[memberNames.length - 1]} se han unido al grupo`;
    } else {
      systemContent = `${memberNames.slice(0, 3).join(', ')} y ${memberNames.length - 3} más se han unido al grupo`;
    }
    
    const systemMsg: Message = {
      id: Date.now().toString(),
      contenido: systemContent,
      timestamp: new Date().toISOString(),
      leido: true,
      esMio: false,
      tipo: 'sistema',
      emisorNombre: 'Sistema',
      grupoId: selectedGroup.id
    };
    setGroupMessages(prev => [...prev, systemMsg]);
    showToast(`${userToAdd.nombre} agregado al grupo`, 'success');
  };

  const handleToggleUserStatus = (u: User) => {
    setConfirmDialog({ visible: true, title: u.estado === 'active' ? 'Desactivar Usuario' : 'Activar Usuario', message: u.estado === 'active' ? `¿Desactivar a ${u.nombre}?` : `¿Activar a ${u.nombre}?`, type: 'warning', onConfirm: () => {
      setUsers(prev => prev.map(user => user.id === u.id ? { ...user, estado: user.estado === 'active' ? 'inactive' : 'active' } : user));
      setConfirmDialog(prev => ({ ...prev, visible: false }));
      showToast(u.estado === 'active' ? 'Usuario desactivado' : 'Usuario activado', 'success');
    }});
  };

  const handleDeleteUser = (u: User) => {
    setConfirmDialog({ visible: true, title: 'Eliminar Usuario', message: `¿Eliminar definitivamente a ${u.nombre}?`, type: 'danger', onConfirm: () => {
      setUsers(prev => prev.filter(user => user.id !== u.id)); setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Usuario eliminado', 'success');
    }});
  };

  const handleCreateCompany = () => {
    if (!newCompanyName.trim()) { showToast('Ingresa nombre de empresa', 'info'); return; }
    setConfirmDialog({ visible: true, title: 'Crear Empresa', message: `¿Crear empresa "${newCompanyName}"?`, type: 'success', onConfirm: () => {
      const newEmp = { id: `emp-${Date.now()}`, nombre: newCompanyName, direccion: newCompanyAddress, telefono: newCompanyPhone, fechaCreacion: new Date().toISOString() };
      setEmpresas(prev => [...prev, newEmp]); setShowCreateCompanyModal(false); setNewCompanyName(''); setNewCompanyAddress(''); setNewCompanyPhone('');
      setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Empresa creada', 'success');
    }});
  };

  const handleDeleteCompany = (emp: {id: string, nombre: string}) => {
    setConfirmDialog({ visible: true, title: 'Eliminar Empresa', message: `¿Eliminar "${emp.nombre}"? Se eliminarán todos sus datos.`, type: 'danger', onConfirm: () => {
      setEmpresas(prev => prev.filter(e => e.id !== emp.id)); setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Empresa eliminada', 'success');
    }});
  };

  const canManageCompany = user?.rol === 'owner' || user?.rol === 'admin';
  const canManageZones = user?.rol === 'owner' || user?.rol === 'admin' || user?.rol === 'recepcion';

  const handleTogglePinGroup = (grupoId: string) => {
    if (pinnedGroups.includes(grupoId)) {
      setPinnedGroups(prev => prev.filter(id => id !== grupoId));
    } else {
      if (pinnedGroups.length >= 4) {
        showToast('Máximo 4 grupos fijados', 'info');
        return;
      }
      setPinnedGroups(prev => [...prev, grupoId]);
    }
  };

  const handleTogglePinChat = (chatId: string) => {
    if (pinnedChats.includes(chatId)) {
      setPinnedChats(prev => prev.filter(id => id !== chatId));
    } else {
      if (pinnedChats.length >= 4) {
        showToast('Máximo 4 chats fijados', 'info');
        return;
      }
      setPinnedChats(prev => [...prev, chatId]);
    }
  };

  const handleToggleArchiveGroup = (grupoId: string) => {
    const equipo = equipos.find(eq => eq.id === grupoId);
    if (archivedGroups.includes(grupoId)) {
      setArchivedGroups(prev => prev.filter(id => id !== grupoId));
      if (equipo) {
        setArchivedEquipos(prev => prev.filter(eq => eq.id !== grupoId));
      }
      showToast('Grupo restaurado', 'success');
    } else {
      setArchivedGroups(prev => [...prev, grupoId]);
      if (equipo) {
        setArchivedEquipos(prev => [...prev, equipo]);
        setEquipos(prev => prev.filter(eq => eq.id !== grupoId));
      }
      setSelectedGroup(null);
      showToast('Grupo archivado', 'success');
    }
  };

  const handleUnarchiveGroup = (grupoId: string) => {
    const equipo = archivedEquipos.find(eq => eq.id === grupoId);
    if (equipo) {
      setEquipos(prev => [...prev, equipo]);
      setArchivedEquipos(prev => prev.filter(eq => eq.id !== grupoId));
      setArchivedGroups(prev => prev.filter(id => id !== grupoId));
      showToast('Grupo restaurado', 'success');
    }
  };

  const handleUnarchiveChat = (chatId: string) => {
    const convo = archivedConversations.find(c => c.usuarioId === chatId);
    if (convo) {
      setConversations(prev => [...prev, convo]);
      setArchivedConversations(prev => prev.filter(c => c.usuarioId !== chatId));
      showToast('Chat restaurado', 'success');
    }
  };

  const resetNewMapPoint = () => {
    setNewMapPoint({ nombre: '', lat: '', lng: '', tipo: 'Punto' });
  };

  const handleOpenAddMap = () => {
    resetNewMapPoint();
    setShowAddMapModal(true);
  };

  const isMapPointInputValid = (input: MapPointInput) => {
    const candidate = normalizeMapPoint(input);
    if (!candidate) {
      showToast('Entrada de mapa inválida. Verifica nombre, latitud y longitud.', 'error');
    }
    return candidate;
  };

  const handleSaveMapPoint = () => {
    const candidate = isMapPointInputValid(newMapPoint);
    if (!candidate) return;

    addMapPoint(candidate);
    setShowAddMapModal(false);
    showToast(`Mapa '${candidate.nombre}' agregado`, 'success');
  };

  const isNewUserDataValid = () => {
    if (!newUserData.nombre.trim() || !newUserData.usuario.trim()) {
      showToast('Nombre y usuario son obligatorios', 'info');
      return false;
    }
    if (!newUserData.rol || !['guardia', 'admin', 'recepcion'].includes(newUserData.rol)) {
      showToast('Rol inválido: selecciona Guardia, Administrador o Recepción', 'info');
      return false;
    }
    return true;
  };

  const buildUserFromData = (): User => ({
    id: `user-${Date.now()}`,
    nombre: newUserData.nombre.trim(),
    usuario: newUserData.usuario.trim(),
    identidad: newUserData.identidad?.trim(),
    telefono: newUserData.telefono?.trim(),
    email: newUserData.email?.trim(),
    rol: newUserData.rol as 'guardia' | 'admin' | 'recepcion',
    estado: 'active',
    empresaId: user?.empresaId || 'techcorp',
  });

  const clearNewUserForm = () => {
    setNewUserData({ nombre: '', usuario: '', identidad: '', telefono: '', email: '', password: '', rol: 'guardia' });
  };

  const handleCreateUser = () => {
    if (!isNewUserDataValid()) return;

    const nuevoUsuario = buildUserFromData();
    setUsers(prev => [...prev, nuevoUsuario]);
    setShowCreateUserModal(false);
    clearNewUserForm();
    showToast('Usuario creado exitosamente', 'success');
  };

  const generateQRCode = async (type: 'chat' | 'group') => {
    const myEmpresaId = user?.empresaId || 'techcorp';
    const qrData = JSON.stringify({
      type,
      empresaId: myEmpresaId,
      targetId: type === 'group' ? selectedGroup?.id : user?.id,
      timestamp: Date.now()
    });
    setQrCodeData(qrData);
    setQrScannerTarget(type);
    setShowQRCode(true);
  };

  const handleQRScan = (decoded: string) => {
    try {
      const data = JSON.parse(decoded);
      const myEmpresaId = user?.empresaId || 'techcorp';
      
      if (data.empresaId !== myEmpresaId) {
        showToast('No puedes unirte. Empresa diferente.', 'error');
        return;
      }

      if (data.type === 'chat') {
        const targetUser = users.find(u => u.id === data.targetId);
        if (targetUser && !conversations.find(c => c.usuarioId === targetUser.id)) {
          setConversations(prev => [...prev, { usuarioId: targetUser.id, nombre: targetUser.nombre, rol: targetUser.rol, estado: targetUser.estado, ultimoMensaje: 'Nuevo chat', timestamp: new Date().toISOString(), noLeidos: 0 }]);
          showToast(`Chateando con ${targetUser.nombre}`, 'success');
        }
      } else if (data.type === 'group') {
        const targetGroup = equipos.find(eq => eq.id === data.targetId);
        if (targetGroup && !equipos.find(eq => eq.id === data.targetId)) {
          showToast(`Unido al grupo ${targetGroup.nombre}`, 'success');
        }
      }
      setShowQRScanner(false);
    } catch {
      showToast('QR inválido', 'error');
    }
  };

  const handleCreateOrUpdateZone = () => {
    if (!newZoneName.trim() || !newZoneLocation.trim()) { showToast('Completa todos los campos', 'info'); return; }
    setConfirmDialog({ visible: true, title: editingZone ? 'Editar Zona' : 'Crear Zona', message: editingZone ? `¿Actualizar zona "${newZoneName}"?` : `¿Crear zona "${newZoneName}"?`, type: 'success', onConfirm: () => {
      if (editingZone) {
        setCatalogs(prev => prev ? { ...prev, zonas: prev.zonas.map(z => z.id === editingZone.id ? { ...z, nombre: newZoneName, ubicacion: newZoneLocation, color: newZoneColor } : z) } : null);
      } else {
        setCatalogs(prev => prev ? { ...prev, zonas: [...prev.zonas, { id: `zona-${Date.now()}`, nombre: newZoneName, ubicacion: newZoneLocation, color: newZoneColor }] } : null);
      }
      setShowZoneModal(false); setNewZoneName(''); setNewZoneLocation(''); setNewZoneColor('#E74C3C'); setEditingZone(null);
      setConfirmDialog(prev => ({ ...prev, visible: false })); showToast(editingZone ? 'Zona actualizada' : 'Zona creada', 'success');
    }});
  };

  const handleDeleteZone = (zona: Zona) => {
    setConfirmDialog({ visible: true, title: 'Eliminar Zona', message: `¿Eliminar "${zona.nombre}"? Se eliminarán todos los datos asociados.`, type: 'danger', onConfirm: () => {
      setCatalogs(prev => prev ? { ...prev, zonas: prev.zonas.filter(z => z.id !== zona.id) } : null);
      setConfirmDialog(prev => ({ ...prev, visible: false })); showToast('Zona eliminada', 'success');
    }});
  };

  const openEditZone = (zona: Zona) => {
    setEditingZone(zona); setNewZoneName(zona.nombre); setNewZoneLocation(zona.ubicacion); setNewZoneColor(zona.color || '#E74C3C'); setShowZoneModal(true);
  };

  const toggleZone = (zonaId: string) => {
    setExpandedZones(prev => { const next = new Set(prev); if (next.has(zonaId)) next.delete(zonaId); else next.add(zonaId); return next; });
  };

  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => { const next = new Set(prev); if (next.has(userId)) next.delete(userId); else next.add(userId); return next; });
  };

  const toggleAdminSection = (section: string) => {
    setCollapsedAdminSections(prev => { const next = new Set(prev); if (next.has(section)) next.delete(section); else next.add(section); return next; });
  };

  const viewMemberProfile = (member: any) => {
    const fullUser = users.find(u => u.id === member.id);
    if (fullUser) {
      setMemberProfile(fullUser);
      setShowMemberProfileModal(true);
    }
  };

  const canManageGroup = user?.rol === 'admin' || user?.rol === 'recepcion';

  if (loading) return <LoadingSpinner />;

  const inactiveUsers = users.filter(u => u.rol === 'guardia' && u.estado === 'inactive' && (user?.rol === 'owner' || user?.rol === 'admin' || u.empresaId === user?.empresaId));
  const activeUsers = users.filter(u => u.rol === 'guardia' && u.estado !== 'inactive' && (user?.rol === 'owner' || user?.rol === 'admin' || u.empresaId === user?.empresaId));
  
  const userSearchLower = userSearchTerm.toLowerCase();
  const filteredInactiveUsers = inactiveUsers.filter(u => !userSearchTerm || u.usuario.toLowerCase().includes(userSearchLower) || (u.identidad && u.identidad.toLowerCase().includes(userSearchLower)));
  const filteredActiveUsers = activeUsers.filter(u => !userSearchTerm || u.usuario.toLowerCase().includes(userSearchLower) || (u.identidad && u.identidad.toLowerCase().includes(userSearchLower)));
  const companyFilteredInactiveUsers = selectedCompanyViewFilter ? filteredInactiveUsers.filter(u => u.empresaId === selectedCompanyViewFilter) : filteredInactiveUsers;
  const companyFilteredActiveUsers = selectedCompanyViewFilter ? filteredActiveUsers.filter(u => u.empresaId === selectedCompanyViewFilter) : filteredActiveUsers;
  
  const availableMembersToAdd = users.filter(u => u.rol === 'guardia' && u.estado !== 'inactive' && (user?.rol === 'owner' || user?.rol === 'admin' || u.empresaId === user?.empresaId) && !selectedGroup?.miembros.some(m => m.id === u.id));

  const filteredEmpresas = empresas.filter(emp => user?.rol === 'owner' || user?.rol === 'admin' || user?.empresaId === emp.id);
  const filteredStats = stats ? { ...stats, guardiasTotales: activeUsers.length + inactiveUsers.length, guardiasActivos: activeUsers.length } : null;
  const filteredAvailableMembers = memberSearchTerm ? availableMembersToAdd.filter(u => u.identidad?.includes(memberSearchTerm) || u.nombre.toLowerCase().includes(memberSearchTerm.toLowerCase()) || u.usuario.toLowerCase().includes(memberSearchTerm.toLowerCase())) : availableMembersToAdd;

  return (
    <div style={{ width: '100%', maxWidth: 1600, background: COLORS.gray800, borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: `1px solid ${COLORS.gray600}` }}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={hideToast} />
      
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`, padding: '20px 40px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 50, height: 50, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-shield-alt" style={{ fontSize: 24, color: COLORS.primary }} />
          </div>
          <div><h2 style={{ fontSize: 20, fontWeight: 700 }}>SecureNet</h2><p style={{ fontSize: 13, opacity: 0.9 }}>Sistema de Control de Guardias</p></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fas fa-building" /><span>TechCorp Industries</span>
          </div>
          {(user?.rol === 'admin' || user?.rol === 'owner') && <Button variant="secondary" size="sm" icon="fa-chart-line" onClick={() => setShowAdminPanel(!showAdminPanel)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>Panel de Control</Button>}
          <div style={{ position: 'relative' }} onClick={() => setShowProfileModal(true)}>
            <Avatar name={user?.nombre || ''} role={user?.rol} size="lg" />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: '50%', backgroundColor: user?.estado === 'active' ? COLORS.green : COLORS.gray400, border: '2px solid white' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 90px)' }}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          equipos={equipos.filter(eq => user?.rol === 'owner' || user?.rol === 'admin' || eq.empresaId === user?.empresaId)}
          conversations={conversations}
          archivedEquipos={archivedEquipos}
          archivedConversations={archivedConversations}
          selectedGroupId={selectedGroup?.id}
          selectedChatId={selectedChat?.usuarioId}
          pinnedGroupIds={pinnedGroups}
          pinnedChatIds={pinnedChats}
          onSelectGroup={(eq) => { setSelectedGroup(eq); setSelectedChat(null); }}
          onSelectChat={(convo) => { setSelectedChat(convo); setSelectedGroup(null); }}
          onUnarchiveGroup={handleUnarchiveGroup}
          onUnarchiveChat={handleUnarchiveChat}
          canManageGroup={canManageGroup}
          onCreateGroup={() => setShowCreateGroupModal(true)}
          onAddMap={handleOpenAddMap}
          mapPoints={mapPoints}
        />

        <ChatArea
          selectedChat={selectedChat}
          selectedGroup={selectedGroup}
          messages={selectedGroup ? groupMessages : messages}
          setMessages={setMessages}
          setGroupMessages={setGroupMessages}
          messageText={messageText}
          groupMessageText={groupMessageText}
          showFileMenu={showFileMenu}
          isRecording={isRecording}
          recordingDuration={voiceDuration}
          onMessageTextChange={setMessageText}
          onGroupMessageTextChange={setGroupMessageText}
          onSendMessage={handleSendMessage}
          onSendGroupMessage={handleSendGroupMessage}
          onVoiceRecording={startVoiceRecording}
          onStopRecording={stopVoiceRecording}
          onFileMenuToggle={() => setShowFileMenu(!showFileMenu)}
          onShowToast={(msg, type) => showToast(msg, type as 'success' | 'error' | 'info')}
          onCall={() => showToast('Llamada', 'info')}
          onVideoCall={() => showToast('Videollamada', 'info')}
          onInfo={() => showToast('Info', 'info')}
          onAlert={handleSendAlertToGroup}
          imageInputRef={imageInputRef}
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          onImageSelect={handleImageSelect}
          onFileSelect={handleFileSelect}
          onVideoSelect={handleVideoSelect}
          canManageGroup={canManageGroup}
          isPinned={selectedGroup ? pinnedGroups.includes(selectedGroup.id) : false}
          isArchived={selectedGroup ? archivedGroups.includes(selectedGroup.id) : false}
          onPin={selectedGroup ? () => { setShowGroupMenu(false); handleTogglePinGroup(selectedGroup.id); } : undefined}
          onArchive={selectedGroup ? () => { setShowGroupMenu(false); handleToggleArchiveGroup(selectedGroup.id); } : undefined}
          onConfig={() => { setShowGroupMenu(false); setShowGroupConfigModal(true); }}
          showMenu={showGroupMenu}
          onToggleMenu={() => setShowGroupMenu(!showGroupMenu)}
        />

        {showAdminPanel && (
          <div style={{ width: 450, background: 'white', borderLeft: `1px solid ${COLORS.gray200}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: COLORS.purple, color: 'white', padding: 20 }}><h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-cog" /> Panel de Control</h3></div>
            <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.gray200}` }}>
              {[
                { key: 'overview', label: 'Resumen' },
                { key: 'users', label: 'Usuarios' },
                ...(previewAsRole !== 'guardia' ? [{ key: 'empresas', label: 'Empresas' as const }] : []),
                { key: 'aws', label: 'AWS' }
              ].map(tab => (
                <div key={tab.key} onClick={() => setActiveAdminTab(tab.key as 'overview' | 'users' | 'empresas' | 'aws')} style={{ flex: 1, padding: 15, textAlign: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: activeAdminTab === tab.key ? COLORS.purple : COLORS.gray500, borderBottom: activeAdminTab === tab.key ? `3px solid ${COLORS.purple}` : '3px solid transparent' }}>{tab.label}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {activeAdminTab === 'overview' && stats && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 25 }}>
                    <div style={{ background: COLORS.gray100, borderRadius: 12, padding: 20, textAlign: 'center' }}><i className="fas fa-users" style={{ fontSize: 24, color: COLORS.primary, marginBottom: 10, display: 'block' }} /><div style={{ fontSize: 24, fontWeight: 700 }}>{(filteredStats || stats)?.guardiasTotales}</div><div style={{ fontSize: 12, color: COLORS.gray500 }}>Guardias</div></div>
                    <div style={{ background: COLORS.gray100, borderRadius: 12, padding: 20, textAlign: 'center' }}><i className="fas fa-check-circle" style={{ fontSize: 24, color: COLORS.green, marginBottom: 10, display: 'block' }} /><div style={{ fontSize: 24, fontWeight: 700 }}>{(filteredStats || stats)?.checkinsHoy}</div><div style={{ fontSize: 12, color: COLORS.gray500 }}>Check-ins</div></div>
                    <div style={{ background: COLORS.gray100, borderRadius: 12, padding: 20, textAlign: 'center' }}><i className="fas fa-exclamation-triangle" style={{ fontSize: 24, color: COLORS.red, marginBottom: 10, display: 'block' }} /><div style={{ fontSize: 24, fontWeight: 700 }}>{(filteredStats || stats)?.alertasActivas}</div><div style={{ fontSize: 12, color: COLORS.gray500 }}>Alertas</div></div>
                    <div style={{ background: COLORS.gray100, borderRadius: 12, padding: 20, textAlign: 'center' }}><i className="fas fa-shield-alt" style={{ fontSize: 24, color: COLORS.blue, marginBottom: 10, display: 'block' }} /><div style={{ fontSize: 24, fontWeight: 700 }}>{(filteredStats || stats)?.cobertura}%</div><div style={{ fontSize: 12, color: COLORS.gray500 }}>Cobertura</div></div>
                  </div>
                  <h4 style={{ fontSize: 13, color: COLORS.gray700, marginBottom: 15 }}><i className="fas fa-clock" style={{ color: COLORS.purple, marginRight: 8 }} /> Actividad Reciente</h4>
                  {activity.slice(0, 5).map(item => (
                    <Card key={item.usuario.id} style={{ marginBottom: 10, padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => { const u = users.find(us => us.id === item.usuario.id); if (u) { setMemberProfile(u); setShowMemberProfileModal(true); } }}>
                        <Avatar name={item.usuario.nombre} role={item.usuario.rol} size="sm" />
                        <div style={{ flex: 1, cursor: 'pointer' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{item.usuario.nombre}</div><div style={{ fontSize: 11, color: COLORS.gray500 }}>{item.ultimaAlerta ? `Alerta: ${item.ultimaAlerta.tipo}` : item.ultimoCheckin ? 'Check-in' : 'Sin actividad'}</div></div>
                        <StatusBadge status={item.estado} />
                      </div>
                    </Card>
                  ))}
                </>
              )}
              {activeAdminTab === 'users' && (
                <>
                  {canManageGroup && <button onClick={() => setShowCreateUserModal(true)} style={{ width: '100%', padding: 15, marginBottom: 20, background: COLORS.purple, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-plus" /> Nuevo Guardia</button>}
                  
                  <div style={{ marginBottom: 15, padding: 12, background: COLORS.gray100, borderRadius: 8 }}>
                    <input type="text" value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)} placeholder="Buscar por usuario o ID..." style={{ width: '100%', padding: 10, border: `1px solid ${COLORS.gray300}`, borderRadius: 6, marginBottom: 10, fontSize: 13 }} />
                    {canManageCompany && <select value={selectedCompanyViewFilter} onChange={(e) => setSelectedCompanyViewFilter(e.target.value)} style={{ width: '100%', padding: 10, border: `1px solid ${COLORS.gray300}`, borderRadius: 6, fontSize: 13, background: 'white' }}><option value="">Todas las empresas</option>{empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select>}
                  </div>
                  
                  {companyFilteredInactiveUsers.length > 0 && (
                    <div style={{ marginBottom: 15 }}>
                      <div onClick={() => toggleAdminSection('desactivados')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#2d2d2d', borderRadius: 8, cursor: 'pointer', marginBottom: collapsedAdminSections.has('desactivados') ? 0 : 10 }}>
                        <h4 style={{ fontSize: 13, color: '#888', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-slash" /> Desactivados ({companyFilteredInactiveUsers.length})</h4>
                        <i className={`fas fa-chevron-${collapsedAdminSections.has('desactivados') ? 'down' : 'up'}`} style={{ color: '#666' }} />
                      </div>
                      {!collapsedAdminSections.has('desactivados') && (
                        <div style={{ padding: '0 5px' }}>
                          {companyFilteredInactiveUsers.map(u => (
                            <div key={u.id}>
                              <div onClick={() => toggleUser(u.id)} style={{ display: 'flex', alignItems: 'center', padding: 12, background: '#2d2d2d', borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.gray600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                  <i className="fas fa-user" style={{ color: '#666' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: 13, color: '#888' }}>{u.nombre}</div>
                                  <div style={{ fontSize: 11, color: '#666' }}>{u.usuario} {u.identidad && `• ID: ${u.identidad}`}</div>
                                </div>
                                <i className={`fas fa-chevron-${expandedUsers.has(u.id) ? 'up' : 'down'}`} style={{ color: '#666', fontSize: 12 }} />
                              </div>
                              {expandedUsers.has(u.id) && (
                                <div style={{ padding: '10px 12px', background: '#1a1a1a', borderRadius: '0 0 8 8', marginTop: -8, marginBottom: 8 }}>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => handleToggleUserStatus(u)} style={{ flex: 1, padding: 8, background: COLORS.green, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}><i className="fas fa-check" /> Activar</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {canManageCompany && users.filter(u => u.rol === 'admin').length > 0 && (
                    <div style={{ marginBottom: 15 }}>
                      <div onClick={() => toggleAdminSection('admins')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: COLORS.purple + '20', borderRadius: 8, cursor: 'pointer', marginBottom: collapsedAdminSections.has('admins') ? 0 : 10 }}>
                        <h4 style={{ fontSize: 13, color: COLORS.purple, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-shield" /> Administradores ({users.filter(u => u.rol === 'admin').length})</h4>
                        <i className={`fas fa-chevron-${collapsedAdminSections.has('admins') ? 'down' : 'up'}`} style={{ color: COLORS.purple }} />
                      </div>
                      {!collapsedAdminSections.has('admins') && (
                        <div style={{ padding: '0 5px' }}>
                          {users.filter(u => u.rol === 'admin').map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: 10, background: 'white', borderRadius: 8, marginBottom: 6, border: `1px solid ${COLORS.gray200}` }}>
                              <Avatar name={u.nombre} role={u.rol} size="sm" />
                              <div style={{ flex: 1, marginLeft: 10 }}><div style={{ fontWeight: 600, fontSize: 12 }}>{u.nombre}</div></div>
                              <button onClick={() => viewMemberProfile(u)} style={{ padding: '4px 8px', background: COLORS.gray100, border: 'none', borderRadius: 4, cursor: 'pointer' }}><i className="fas fa-eye" style={{ color: COLORS.blue, fontSize: 10 }} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {canManageCompany && users.filter(u => u.rol === 'recepcion').length > 0 && (
                    <div style={{ marginBottom: 15 }}>
                      <div onClick={() => toggleAdminSection('recepcionistas')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: COLORS.teal + '20', borderRadius: 8, cursor: 'pointer', marginBottom: collapsedAdminSections.has('recepcionistas') ? 0 : 10 }}>
                        <h4 style={{ fontSize: 13, color: COLORS.teal, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-clock" /> Recepcionistas ({users.filter(u => u.rol === 'recepcion').length})</h4>
                        <i className={`fas fa-chevron-${collapsedAdminSections.has('recepcionistas') ? 'down' : 'up'}`} style={{ color: COLORS.teal }} />
                      </div>
                      {!collapsedAdminSections.has('recepcionistas') && (
                        <div style={{ padding: '0 5px' }}>
                          {users.filter(u => u.rol === 'recepcion').map(u => (
                            <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: 10, background: 'white', borderRadius: 8, marginBottom: 6, border: `1px solid ${COLORS.gray200}` }}>
                              <Avatar name={u.nombre} role={u.rol} size="sm" />
                              <div style={{ flex: 1, marginLeft: 10 }}><div style={{ fontWeight: 600, fontSize: 12 }}>{u.nombre}</div></div>
                              <button onClick={() => viewMemberProfile(u)} style={{ padding: '4px 8px', background: COLORS.gray100, border: 'none', borderRadius: 4, cursor: 'pointer' }}><i className="fas fa-eye" style={{ color: COLORS.blue, fontSize: 10 }} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: 15 }}>
                    <div onClick={() => toggleAdminSection('guardiasActivos')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: COLORS.primary + '20', borderRadius: 8, cursor: 'pointer', marginBottom: collapsedAdminSections.has('guardiasActivos') ? 0 : 10 }}>
                      <h4 style={{ fontSize: 13, color: COLORS.primary, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-shield" /> Guardias Activos ({companyFilteredActiveUsers.length})</h4>
                      <i className={`fas fa-chevron-${collapsedAdminSections.has('guardiasActivos') ? 'down' : 'up'}`} style={{ color: COLORS.primary }} />
                    </div>
                    {!collapsedAdminSections.has('guardiasActivos') && (
                      <div style={{ padding: '0 5px' }}>
                        {companyFilteredActiveUsers.map(u => (
                          <div key={u.id}>
                            <div onClick={() => toggleUser(u.id)} style={{ display: 'flex', alignItems: 'center', padding: 12, background: 'white', border: `1px solid ${COLORS.gray200}`, borderRadius: 8, marginBottom: 8, cursor: 'pointer' }}>
                              <Avatar name={u.nombre} role={u.rol} size="sm" />
                              <div style={{ flex: 1, marginLeft: 12 }}>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{u.nombre}</div>
                                <div style={{ fontSize: 11, color: COLORS.gray500 }}>{u.usuario} {u.identidad && `• ID: ${u.identidad}`} {u.telefono && `• ${u.telefono}`} {u.empresaId && `• ${empresas.find(e => e.id === u.empresaId)?.nombre || 'Sin empresa'}`}</div>
                              </div>
                              <StatusBadge status={u.estado} />
                              <i className={`fas fa-chevron-${expandedUsers.has(u.id) ? 'up' : 'down'}`} style={{ color: COLORS.gray400, marginLeft: 8, fontSize: 12 }} />
                            </div>
                            {expandedUsers.has(u.id) && (
                              <div style={{ padding: '10px 12px', background: COLORS.gray50, borderRadius: '0 0 8 8', marginTop: -8, marginBottom: 8 }}>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button onClick={() => viewMemberProfile(u)} style={{ flex: 1, padding: 8, background: COLORS.blue, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}><i className="fas fa-eye" /> Ver Perfil</button>
                                  {canManageGroup && <><button onClick={() => { setEditingUser(u); setShowEditUserModal(true); }} style={{ flex: 1, padding: 8, background: COLORS.purple, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}><i className="fas fa-edit" /> Editar</button>
                                  <button onClick={() => handleToggleUserStatus(u)} style={{ flex: 1, padding: 8, background: COLORS.yellow, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}><i className="fas fa-ban" /> {u.estado === 'active' ? 'Desactivar' : 'Activar'}</button></>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeAdminTab === 'empresas' && canManageCompany && (
                <>
                  <button onClick={() => setShowCreateCompanyModal(true)} style={{ width: '100%', padding: 15, marginBottom: 20, background: COLORS.purple, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-plus" /> Nueva Empresa</button>
                  
                  <div style={{ marginBottom: 15, padding: 12, background: COLORS.gray100, borderRadius: 8 }}>
                    <input type="text" value={companySearchTerm} onChange={(e) => setCompanySearchTerm(e.target.value)} placeholder="Buscar empresa..." style={{ width: '100%', padding: 10, border: `1px solid ${COLORS.gray300}`, borderRadius: 6, fontSize: 13 }} />
                  </div>

                  <h4 style={{ fontSize: 13, color: COLORS.gray700, marginBottom: 15 }}>Empresas de Seguridad ({filteredEmpresas.length})</h4>
                  {filteredEmpresas.filter(emp => !companySearchTerm || emp.nombre.toLowerCase().includes(companySearchTerm.toLowerCase())).map(emp => (
                    <Card key={emp.id} style={{ marginBottom: 10, padding: 15 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-building" style={{ color: 'white' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.nombre}</div>
                            <div style={{ fontSize: 11, color: COLORS.gray500 }}>{emp.direccion}</div>
                            <div style={{ fontSize: 11, color: COLORS.gray500 }}><i className="fas fa-phone" style={{ marginRight: 5 }} />{emp.telefono}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setSelectedCompanyUsers(selectedCompanyUsers === emp.id ? null : emp.id)} style={{ padding: '8px 12px', background: selectedCompanyUsers === emp.id ? COLORS.primary : COLORS.teal, border: 'none', borderRadius: 6, cursor: 'pointer' }}><i className="fas fa-users" style={{ color: 'white' }} /></button>
                          <button onClick={() => { setEditingCompany(emp); setShowEditCompanyModal(true); }} style={{ padding: '8px 12px', background: COLORS.purple, border: 'none', borderRadius: 6, cursor: 'pointer' }}><i className="fas fa-edit" style={{ color: 'white' }} /></button>
                          <button onClick={() => { setSelectedCompanyView(emp); setShowCompanyConfigModal(true); }} style={{ padding: '8px 12px', background: COLORS.gray100, border: 'none', borderRadius: 6, cursor: 'pointer' }}><i className="fas fa-eye" style={{ color: COLORS.blue }} /></button>
                          <button onClick={() => handleDeleteCompany(emp)} style={{ padding: '8px 12px', background: COLORS.red, border: 'none', borderRadius: 6, cursor: 'pointer' }}><i className="fas fa-trash" style={{ color: 'white' }} /></button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {selectedCompanyUsers && (
                    <div style={{ marginTop: 20, padding: 15, background: COLORS.gray100, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <h4 style={{ fontSize: 14, color: COLORS.gray700, margin: 0 }}><i className="fas fa-users" /> Usuarios de {empresas.find(e => e.id === selectedCompanyUsers)?.nombre}</h4>
                        <button onClick={() => setSelectedCompanyUsers(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><i className="fas fa-times" /></button>
                      </div>
                      {users.filter(u => u.empresaId === selectedCompanyUsers).length === 0 ? (
                        <p style={{ fontSize: 12, color: COLORS.gray500, textAlign: 'center' }}>No hay usuarios en esta empresa</p>
                      ) : (
                        users.filter(u => u.empresaId === selectedCompanyUsers).map(u => (
                          <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: 10, background: 'white', borderRadius: 8, marginBottom: 8 }}>
                            <Avatar name={u.nombre} role={u.rol} size="sm" />
                            <div style={{ flex: 1, marginLeft: 10 }}><div style={{ fontWeight: 600, fontSize: 12 }}>{u.nombre}</div><div style={{ fontSize: 10, color: COLORS.gray500 }}>{u.usuario} • {u.identidad}</div></div>
                            <RoleBadge role={u.rol} />
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 30, padding: 20, background: COLORS.gray100, borderRadius: 12 }}>
                    <h4 style={{ fontSize: 14, color: COLORS.gray700, marginBottom: 15 }}><i className="fas fa-eye" style={{ marginRight: 8 }} /> Vista Previa</h4>
                    <p style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 15 }}>Verifica cómo sehen las diferentes vistas de usuario.</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setPreviewAsRole('guardia')} style={{ flex: 1, padding: 10, background: previewAsRole === 'guardia' ? COLORS.primary : 'white', color: previewAsRole === 'guardia' ? 'white' : COLORS.gray700, border: `1px solid ${COLORS.gray300}`, borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}><i className="fas fa-user-shield" /> Vista Guardia</button>
                    </div>
                    {previewAsRole === 'guardia' && (
                      <div style={{ marginTop: 15, padding: 15, background: 'white', borderRadius: 8, border: `1px solid ${COLORS.gray200}` }}>
                        <p style={{ fontSize: 12, color: COLORS.gray600, textAlign: 'center' }}>Vista de Guardia - Solo ve sus grupos, puede chatear y recibir alertas. No tiene acceso al panel de control.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {activeAdminTab === 'aws' && awsMetrics && (
                <>
                  <div style={{ background: '#232F3E', borderRadius: 12, padding: 20, color: 'white', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}><i className="fab fa-aws" style={{ fontSize: 24, color: '#FF9900' }} /><span style={{ fontWeight: 600 }}>Recursos Cloud</span></div>
                    <div style={{ marginBottom: 15 }}><div style={{ fontSize: 12, marginBottom: 5 }}>EC2: {awsMetrics.recursos.ec2.actual}/{awsMetrics.recursos.ec2.maximo}</div><div style={{ height: 8, background: '#444', borderRadius: 4 }}><div style={{ height: '100%', width: `${awsMetrics.recursos.ec2.porcentaje}%`, background: '#27AE60', borderRadius: 4 }} /></div></div>
                    <div style={{ marginBottom: 15 }}><div style={{ fontSize: 12, marginBottom: 5 }}>RDS: {awsMetrics.recursos.rds.actual}{awsMetrics.recursos.rds.unidad}/{awsMetrics.recursos.rds.maximo}{awsMetrics.recursos.rds.unidad}</div><div style={{ height: 8, background: '#444', borderRadius: 4 }}><div style={{ height: '100%', width: `${awsMetrics.recursos.rds.porcentaje}%`, background: '#3498DB', borderRadius: 4 }} /></div></div>
                    <div><div style={{ fontSize: 12, marginBottom: 5 }}>S3: {awsMetrics.recursos.s3.actual}{awsMetrics.recursos.s3.unidad}/{awsMetrics.recursos.s3.maximo}{awsMetrics.recursos.s3.unidad}</div><div style={{ height: 8, background: '#444', borderRadius: 4 }}><div style={{ height: '100%', width: `${awsMetrics.recursos.s3.porcentaje}%`, background: '#F39C12', borderRadius: 4 }} /></div></div>
                  </div>
                  <h4 style={{ fontSize: 13, color: COLORS.gray700, marginBottom: 15 }}><i className="fas fa-dollar-sign" /> Costos del Mes</h4>
                  <div style={{ background: 'white', padding: 15, borderRadius: 12, border: `1px solid ${COLORS.gray200}` }}>{awsMetrics.costos.map(c => <div key={c.servicio} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><span>{c.servicio}</span><span style={{ fontWeight: 600 }}>${c.costo.toFixed(2)}</span></div>)}<hr style={{ margin: '10px 0', border: 'none', borderTop: `1px solid ${COLORS.gray200}` }} /><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Total</span><span style={{ color: COLORS.purple }}>${awsMetrics.costoTotal.toFixed(2)}</span></div></div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showProfileModal && (
        <Modal visible={showProfileModal} title="Mi Perfil" icon="fa-user" variant="primary" onClose={() => setShowProfileModal(false)}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: COLORS.primary, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-user" style={{ fontSize: 40, color: 'white' }} /></div>
            <h2 style={{ marginBottom: 5 }}>{user?.nombre}</h2>
            <p style={{ color: COLORS.gray500, marginBottom: 20 }}>{user?.email}</p>
            <div style={{ display: 'grid', gap: 15, textAlign: 'left', marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-tag" style={{ marginRight: 10 }} />Usuario</span><span style={{ fontWeight: 600 }}>{user?.usuario}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-id-card" style={{ marginRight: 10 }} />Identidad</span><span style={{ fontWeight: 600 }}>{user?.identidad || 'No registrado'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-user-tag" style={{ marginRight: 10 }} />Rol</span><span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user?.rol}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-phone" style={{ marginRight: 10 }} />Teléfono</span><span style={{ fontWeight: 600 }}>{user?.telefono || 'No registrado'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-building" style={{ marginRight: 10 }} />Empresa</span><span style={{ fontWeight: 600 }}>TechCorp Industries</span></div>
            </div>
            <button onClick={() => { setConfirmDialog({ visible: true, title: 'Cerrar Sesión', message: '¿Cerrar sesión?', type: 'warning', onConfirm: () => { clearAuth(); window.location.reload(); } }); }} style={{ marginTop: 20, width: '100%', padding: 12, background: COLORS.red, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-sign-out-alt" /> Cerrar Sesión</button>
          </div>
        </Modal>)}

      {showCreateGroupModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }} onClick={() => { setShowCreateGroupModal(false); setNewGroupName(''); setNewGroupZone(''); setSelectedMembers([]); setSearchIdentity(''); }}>
          <div style={{ backgroundColor: 'white', borderRadius: 24, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.green}dd)`, color: 'white' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}><i className="fas fa-users" /> Crear Nuevo Grupo</h2>
              <button onClick={() => { setShowCreateGroupModal(false); setNewGroupName(''); setNewGroupZone(''); setSelectedMembers([]); setSearchIdentity(''); }} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><i className="fas fa-times" /></button>
            </div>
            <div style={{ padding: 30, maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gap: 15 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-tag" style={{ marginRight: 8 }} />Nombre del Grupo</label><input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ej: Turno Nocturno" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-map-marker-alt" style={{ marginRight: 8 }} />Zona</label><select value={newGroupZone} onChange={(e) => setNewGroupZone(e.target.value)} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}><option value="">Seleccionar zona...</option>{catalogs?.zonas.map(zona => (<option key={zona.id} value={zona.id}>{zona.nombre}</option>))}</select></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 10, display: 'block' }}><i className="fas fa-users" style={{ marginRight: 8 }} />Seleccionar Guardias (buscar por ID)</label>
                  <input type="text" value={searchIdentity} onChange={(e) => setSearchIdentity(e.target.value)} placeholder="Buscar por ID, nombre o usuario..." style={{ width: '100%', padding: 10, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, marginBottom: 10, fontSize: 13 }} />
                  <div style={{ maxHeight: 200, overflowY: 'auto', border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }}>
                    {users.filter(u => u.rol === 'guardia' && (searchIdentity === '' || u.identidad?.includes(searchIdentity) || u.nombre.toLowerCase().includes(searchIdentity.toLowerCase()) || u.usuario.toLowerCase().includes(searchIdentity.toLowerCase()))).map(u => (
                      <label key={u.id} style={{ display: 'flex', alignItems: 'center', padding: 10, borderBottom: `1px solid ${COLORS.gray100}`, cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedMembers.includes(u.id)} onChange={(e) => { if (e.target.checked) setSelectedMembers(prev => [...prev, u.id]); else setSelectedMembers(prev => prev.filter(id => id !== u.id)); }} style={{ marginRight: 10 }} />
                        <Avatar name={u.nombre} role={u.rol} size="sm" />
                        <div style={{ marginLeft: 10 }}><div style={{ fontSize: 13 }}>{u.nombre}</div><div style={{ fontSize: 10, color: COLORS.gray500 }}>{u.usuario} {u.identidad && `• ID: ${u.identidad}`}</div></div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end', marginTop: 20, paddingTop: 20, borderTop: `1px solid ${COLORS.gray200}` }}>
                <button onClick={() => { setShowCreateGroupModal(false); setNewGroupName(''); setNewGroupZone(''); setSelectedMembers([]); }} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: COLORS.gray300, color: COLORS.gray700, cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                <button onClick={handleCreateGroup} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: COLORS.green, color: 'white', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-plus" /> Crear Grupo</button>
              </div>
            </div>
          </div>
        </div>)}

      <Modal visible={showAddMapModal} title="Agregar Punto al Mapa" icon="fa-map-marked-alt" variant="success" onClose={() => setShowAddMapModal(false)} footer={<><Button variant="secondary" onClick={() => setShowAddMapModal(false)}>Cancelar</Button><Button variant="success" icon="fa-save" onClick={handleSaveMapPoint}>Guardar Mapa</Button></>}>
        <div style={{ display: 'grid', gap: 15 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre del punto</label><input type="text" value={newMapPoint.nombre} onChange={(e) => setNewMapPoint(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Ej: Puerta A" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Latitud</label><input type="text" value={newMapPoint.lat} onChange={(e) => setNewMapPoint(prev => ({ ...prev, lat: e.target.value }))} placeholder="Ej: 19.4326" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Longitud</label><input type="text" value={newMapPoint.lng} onChange={(e) => setNewMapPoint(prev => ({ ...prev, lng: e.target.value }))} placeholder="Ej: -99.1332" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Tipo</label><select value={newMapPoint.tipo} onChange={(e) => setNewMapPoint(prev => ({ ...prev, tipo: e.target.value as MapPointInput['tipo'] }))} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, background: 'white' }}>
            <option value='Punto'>Punto</option>
            <option value='Ruta'>Ruta</option>
            <option value='Zona'>Zona</option>
          </select></div>
        </div>
      </Modal>

      <Modal visible={showCreateUserModal} title="Nuevo Usuario" icon="fa-user-plus" variant="success" onClose={() => { setShowCreateUserModal(false); setNewUserData({ nombre: '', usuario: '', identidad: '', telefono: '', email: '', password: '', rol: 'guardia' }); }} footer={<><Button variant="secondary" onClick={() => setShowCreateUserModal(false)}>Cancelar</Button><Button variant="success" icon="fa-plus" onClick={handleCreateUser}>Crear Usuario</Button></>}>
        <div style={{ display: 'grid', gap: 15 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-user" style={{ marginRight: 8 }} />Nombre completo</label><input type="text" value={newUserData.nombre} onChange={(e) => setNewUserData(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Ej: Juan Pérez" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-at" style={{ marginRight: 8 }} />Usuario</label><input type="text" value={newUserData.usuario} onChange={(e) => setNewUserData(prev => ({ ...prev, usuario: e.target.value }))} placeholder="Ej: jperez" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-id-card" style={{ marginRight: 8 }} />ID Identidad</label><input type="text" value={newUserData.identidad} onChange={(e) => setNewUserData(prev => ({ ...prev, identidad: e.target.value }))} placeholder="Ej: ID001" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-phone" style={{ marginRight: 8 }} />Teléfono</label><input type="text" value={newUserData.telefono} onChange={(e) => setNewUserData(prev => ({ ...prev, telefono: e.target.value }))} placeholder="Ej: +52 55 1234 5678" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-envelope" style={{ marginRight: 8 }} />Email</label><input type="email" value={newUserData.email} onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))} placeholder="Ej: jperez@empresa.com" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, fontSize: 14, outline: 'none' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700, marginBottom: 5, display: 'block' }}><i className="fas fa-user-tag" style={{ marginRight: 8 }} />Rol</label><select value={newUserData.rol} onChange={(e) => setNewUserData(prev => ({ ...prev, rol: e.target.value }))} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, background: 'white' }}>
            <option value="guardia">Guardia</option>
            <option value="admin">Administrador</option>
            <option value="recepcion">Recepción</option>
          </select></div>
        </div>
      </Modal>

      <Modal visible={showGroupConfigModal && !!selectedGroup} title={`Configurar: ${selectedGroup?.nombre}`} icon="fa-cog" variant="primary" onClose={() => setShowGroupConfigModal(false)} footer={<Button variant="success" icon="fa-save" onClick={() => { showToast('Grupo actualizado', 'success'); setShowGroupConfigModal(false); }}>Guardar</Button>}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre del Grupo</label><input type="text" defaultValue={selectedGroup?.nombre} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Descripción</label><textarea defaultValue={selectedGroup?.descripcion || ''} placeholder="Descripción del grupo..." style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, minHeight: 80, resize: 'vertical' }} /></div>
          <div style={{ padding: 15, background: COLORS.gray100, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: COLORS.gray500 }}>Fecha de Creación</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedGroup?.fechaCreacion ? new Date(selectedGroup.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible'}</div>
            </div>
            <i className="fas fa-calendar-alt" style={{ fontSize: 24, color: COLORS.purple }} />
          </div>
          <div>
            <h4 style={{ fontSize: 14, color: COLORS.gray700, marginBottom: 10 }}><i className="fas fa-users" /> Miembros del Grupo ({selectedGroup?.miembros.length})</h4>
            <div style={{ maxHeight: 200, overflowY: 'auto', border: `1px solid ${COLORS.gray200}`, borderRadius: 8 }}>
              {selectedGroup?.miembros.map(member => {
                const memberUser = users.find(us => us.id === member.id);
                const empresaNombre = memberUser?.empresaId ? empresas.find(e => e.id === memberUser.empresaId)?.nombre || 'Sin empresa' : 'Sin empresa';
                return (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', padding: 10, borderBottom: `1px solid ${COLORS.gray100}` }}>
                    <Avatar name={member.nombre} role={member.rol} size="sm" />
                    <div style={{ flex: 1, marginLeft: 10 }}><div style={{ fontSize: 13 }}>{member.nombre}</div><div style={{ fontSize: 10, color: COLORS.gray500 }}>{empresaNombre}</div></div>
                    <button onClick={() => { const convo = conversations.find(c => c.usuarioId === member.id); if (convo) { setSelectedChat(convo); setActiveTab('chats'); } else { showToast('Iniciando chat...', 'info'); const newConvo: Conversation = { usuarioId: member.id, nombre: member.nombre, rol: member.rol, estado: member.estado, ultimoMensaje: '', timestamp: new Date().toISOString(), noLeidos: 0 }; setConversations(prev => [...prev, newConvo]); setSelectedChat(newConvo); setActiveTab('chats'); } }} style={{ padding: 5, background: COLORS.teal, border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 5 }}><i className="fas fa-comment" style={{ fontSize: 12, color: 'white' }} /></button>
                    <button onClick={() => { const u = users.find(us => us.id === member.id); if (u) { setMemberProfile(u); setShowMemberProfileModal(true); } }} style={{ padding: 5, background: COLORS.gray100, border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 5 }}><i className="fas fa-eye" style={{ fontSize: 12, color: COLORS.blue }} /></button>
                    <button onClick={() => handleRemoveMemberFromGroup(member.id, member.nombre)} style={{ padding: 5, background: COLORS.red, border: 'none', borderRadius: 4, cursor: 'pointer' }}><i className="fas fa-times" style={{ fontSize: 12, color: 'white' }} /></button>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, color: COLORS.gray700, marginBottom: 10 }}><i className="fas fa-user-plus" /> Agregar Miembros</h4>
            <input type="text" value={memberSearchTerm} onChange={(e) => setMemberSearchTerm(e.target.value)} placeholder="Buscar por ID, nombre o usuario..." style={{ width: '100%', padding: 10, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, marginBottom: 10, fontSize: 13 }} />
            <div style={{ maxHeight: 200, overflowY: 'auto', border: `1px solid ${COLORS.gray200}`, borderRadius: 8 }}>
              {filteredAvailableMembers.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: 10, borderBottom: `1px solid ${COLORS.gray100}` }}>
                  <Avatar name={u.nombre} role={u.rol} size="sm" />
                  <div style={{ flex: 1, marginLeft: 10 }}><div style={{ fontSize: 13 }}>{u.nombre}</div><div style={{ fontSize: 10, color: COLORS.gray500 }}>{u.usuario} {u.identidad && `• ID: ${u.identidad}`}</div></div>
                  <button onClick={() => handleAddMemberToGroup(u.id)} style={{ padding: '6px 12px', background: COLORS.green, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}><i className="fas fa-plus" /> Agregar</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button onClick={() => setShowQRScanner(true)} style={{ flex: 1, padding: 12, background: COLORS.blue, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-qrcode" /> Escanear QR</button>
            <button onClick={() => generateQRCode('group')} style={{ flex: 1, padding: 12, background: COLORS.purple, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-qrcode" /> Generar QR</button>
          </div>
          {selectedGroup && (
            <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
              <button onClick={() => handleTogglePinGroup(selectedGroup.id)} style={{ flex: 1, padding: 12, background: pinnedGroups.includes(selectedGroup.id) ? COLORS.gray400 : COLORS.purple, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-thumbtack" /> {pinnedGroups.includes(selectedGroup.id) ? 'Desfijar' : 'Fijar'}</button>
              <button onClick={() => handleToggleArchiveGroup(selectedGroup.id)} style={{ flex: 1, padding: 12, background: archivedGroups.includes(selectedGroup.id) ? COLORS.green : COLORS.gray500, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-archive" /> {archivedGroups.includes(selectedGroup.id) ? 'Restaurar' : 'Archivar'}</button>
            </div>
          )}
          <div style={{ marginTop: 20, padding: 15, background: COLORS.blue + '15', borderRadius: 8, border: `1px solid ${COLORS.blue}` }}>
            <h4 style={{ fontSize: 14, color: COLORS.gray700, marginBottom: 10 }}><i className="fas fa-download" /> Descargar Medios</h4>
            <p style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 10 }}>Descarga todos los audios y videos de este chat</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { const mediaMessages = groupMessages.filter(m => m.tipo === 'audio' || m.tipo === 'video'); if (mediaMessages.length === 0) { showToast('No hay medios para descargar', 'info'); return; } mediaMessages.forEach((msg, idx) => { if (msg.tipo === 'audio' || msg.tipo === 'video') { const link = document.createElement('a'); link.href = msg.contenido; link.download = `${msg.tipo}_${msg.id}.${msg.tipo === 'audio' ? 'webm' : 'mp4'}`; link.click(); } }); showToast(`${mediaMessages.length} archivo(s) descargado(s)`, 'success'); }} style={{ flex: 1, padding: 12, background: COLORS.blue, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><i className="fas fa-download" /> Descargar Todos</button>
            </div>
          </div>
          {selectedGroup && canManageGroup && (
            <div style={{ marginTop: 15, padding: 15, background: COLORS.red + '15', borderRadius: 8, border: `1px solid ${COLORS.red}` }}>
              <button onClick={() => handleDeleteGroup(selectedGroup.id, selectedGroup.nombre)} style={{ width: '100%', padding: 12, background: COLORS.red, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><i className="fas fa-trash" /> Eliminar Grupo</button>
            </div>
          )}
        </div>
      </Modal>

      <Modal visible={showMemberProfileModal && !!memberProfile} title="Perfil del Guardia" icon="fa-user" variant="primary" onClose={() => { setShowMemberProfileModal(false); setMemberProfile(null); }}>
        {memberProfile && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: memberProfile.estado === 'inactive' ? COLORS.gray400 : COLORS.primary, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-user" style={{ fontSize: 32, color: 'white' }} /></div>
            <h3 style={{ marginBottom: 5 }}>{memberProfile.nombre}</h3>
            <p style={{ color: COLORS.gray500, fontSize: 13, marginBottom: 15 }}>{memberProfile.email}</p>
              <div style={{ display: 'grid', gap: 10, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.gray100, borderRadius: 6 }}><span style={{ color: COLORS.gray500, fontSize: 12 }}>Usuario</span><span style={{ fontWeight: 600, fontSize: 12 }}>{memberProfile.usuario}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.gray100, borderRadius: 6 }}><span style={{ color: COLORS.gray500, fontSize: 12 }}>Empresa</span><span style={{ fontWeight: 600, fontSize: 12 }}>{memberProfile.empresaId ? empresas.find(e => e.id === memberProfile.empresaId)?.nombre || 'Sin empresa' : 'Sin empresa'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.gray100, borderRadius: 6 }}><span style={{ color: COLORS.gray500, fontSize: 12 }}>ID Identidad</span><span style={{ fontWeight: 600, fontSize: 12 }}>{memberProfile.identidad || 'No registrado'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.gray100, borderRadius: 6 }}><span style={{ color: COLORS.gray500, fontSize: 12 }}>Teléfono</span><span style={{ fontWeight: 600, fontSize: 12 }}>{memberProfile.telefono || 'No registrado'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: COLORS.gray100, borderRadius: 6 }}><span style={{ color: COLORS.gray500, fontSize: 12 }}>Estado</span><span style={{ fontWeight: 600, fontSize: 12, color: memberProfile.estado === 'active' ? COLORS.green : COLORS.gray400 }}>{memberProfile.estado === 'active' ? 'Activo' : 'Inactivo'}</span></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal visible={showEditUserModal && !!editingUser} title="Editar Guardia" icon="fa-user-edit" variant="primary" onClose={() => { setShowEditUserModal(false); setEditingUser(null); }}>
        {editingUser && (
          <div style={{ display: 'grid', gap: 15 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre</label><input type="text" defaultValue={editingUser.nombre} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Usuario</label><input type="text" defaultValue={editingUser.usuario} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Empresa</label><select defaultValue={editingUser.empresaId || ''} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8, background: 'white' }}>{empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>ID Identidad</label><input type="text" defaultValue={editingUser.identidad || ''} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Teléfono</label><input type="text" defaultValue={editingUser.telefono || ''} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <button onClick={() => { showToast('Guardia actualizado (Mockup)', 'success'); setShowEditUserModal(false); }} style={{ padding: 12, background: COLORS.green, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Guardar Cambios</button>
            {canManageCompany && (
              <div style={{ marginTop: 10, padding: 15, background: COLORS.red + '15', borderRadius: 8, border: `1px solid ${COLORS.red}` }}>
                <button onClick={() => handleDeleteUser(editingUser)} style={{ width: '100%', padding: 12, background: COLORS.red, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><i className="fas fa-trash" /> Eliminar Guardia</button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog visible={confirmDialog.visible} title={confirmDialog.title} message={confirmDialog.message} type={confirmDialog.type} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(prev => ({ ...prev, visible: false }))} />

      <Modal visible={showCreateCompanyModal} title="Nueva Empresa de Seguridad" icon="fa-building" variant="success" onClose={() => { setShowCreateCompanyModal(false); setNewCompanyName(''); setNewCompanyAddress(''); setNewCompanyPhone(''); }} footer={<><Button variant="secondary" onClick={() => setShowCreateCompanyModal(false)}>Cancelar</Button><Button variant="success" icon="fa-plus" onClick={handleCreateCompany}>Crear Empresa</Button></>}>
        <div style={{ display: 'grid', gap: 15 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre de la Empresa</label><input type="text" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="Ej: Seguridad ABC" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Dirección</label><input type="text" value={newCompanyAddress} onChange={(e) => setNewCompanyAddress(e.target.value)} placeholder="Ej: Av. Principal 123" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Teléfono</label><input type="text" value={newCompanyPhone} onChange={(e) => setNewCompanyPhone(e.target.value)} placeholder="Ej: +52 55 1234 5678" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
        </div>
      </Modal>

      <Modal visible={showCompanyConfigModal && !!selectedCompanyView} title={selectedCompanyView ? selectedCompanyView.nombre : 'Empresa'} icon="fa-building" variant="primary" onClose={() => { setShowCompanyConfigModal(false); setSelectedCompanyView(null); }}>
        {selectedCompanyView && (
          <div style={{ display: 'grid', gap: 15 }}>
            <div style={{ textAlign: 'center', padding: 20, background: COLORS.gray100, borderRadius: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: COLORS.primary, margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-building" style={{ fontSize: 24, color: 'white' }} /></div>
              <h3>{selectedCompanyView.nombre}</h3>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-calendar-alt" style={{ marginRight: 8 }} />Fecha de Creación</span><span style={{ fontWeight: 600 }}>{selectedCompanyView.fechaCreacion ? new Date(selectedCompanyView.fechaCreacion).toLocaleDateString('es-ES') : 'No disponible'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-map-marker-alt" style={{ marginRight: 8 }} />Dirección</span><span style={{ fontWeight: 600 }}>{selectedCompanyView.direccion}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: COLORS.gray100, borderRadius: 8 }}><span style={{ color: COLORS.gray500 }}><i className="fas fa-phone" style={{ marginRight: 8 }} />Teléfono</span><span style={{ fontWeight: 600 }}>{selectedCompanyView.telefono}</span></div>
            </div>
          </div>
        )}
      </Modal>
      <Modal visible={showZoneModal} title={editingZone ? 'Editar Zona' : 'Crear Zona'} icon="fa-map-marker-alt" variant="success" onClose={() => { setShowZoneModal(false); setEditingZone(null); setNewZoneName(''); setNewZoneLocation(''); setNewZoneColor('#E74C3C'); }} footer={<><Button variant="secondary" onClick={() => { setShowZoneModal(false); setEditingZone(null); }}>Cancelar</Button><Button variant="success" icon="fa-save" onClick={handleCreateOrUpdateZone}>{editingZone ? 'Actualizar' : 'Crear'}</Button></>}>
        <div style={{ display: 'grid', gap: 15 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre de la Zona</label><input type="text" value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} placeholder="Ej: Zona Norte" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Ubicación</label><input type="text" value={newZoneLocation} onChange={(e) => setNewZoneLocation(e.target.value)} placeholder="Ej: Av. Principal 123" style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Color</label><div style={{ display: 'flex', gap: 10, marginTop: 5 }}>{['#E74C3C', '#3498DB', '#27AE60', '#F39C12', '#9B59B6', '#1ABC9C'].map(c => <div key={c} onClick={() => setNewZoneColor(c)} style={{ width: 30, height: 30, borderRadius: 8, background: c, cursor: 'pointer', border: newZoneColor === c ? '3px solid white' : 'none', boxShadow: newZoneColor === c ? `0 0 0 2px ${c}` : 'none' }} />)}</div></div>
        </div>
      </Modal>

      <Modal visible={showEditCompanyModal && !!editingCompany} title="Editar Empresa" icon="fa-building" variant="primary" onClose={() => { setShowEditCompanyModal(false); setEditingCompany(null); }} footer={<><Button variant="secondary" onClick={() => { setShowEditCompanyModal(false); setEditingCompany(null); }}>Cancelar</Button><Button variant="success" icon="fa-save" onClick={() => { setEmpresas(prev => prev.map(e => e.id === editingCompany?.id ? editingCompany : e)); setShowEditCompanyModal(false); showToast('Empresa actualizada', 'success'); }}>Guardar</Button></>}>
        {editingCompany && (
          <div style={{ display: 'grid', gap: 15 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Nombre</label><input type="text" value={editingCompany.nombre} onChange={(e) => setEditingCompany({...editingCompany, nombre: e.target.value})} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Dirección</label><input type="text" value={editingCompany.direccion} onChange={(e) => setEditingCompany({...editingCompany, direccion: e.target.value})} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray700 }}>Teléfono</label><input type="text" value={editingCompany.telefono} onChange={(e) => setEditingCompany({...editingCompany, telefono: e.target.value})} style={{ width: '100%', padding: 12, border: `1px solid ${COLORS.gray300}`, borderRadius: 8 }} /></div>
          </div>
        )}
      </Modal>
      
      <Modal visible={!!previewImage} title="Vista previa" icon="fa-image" variant="primary" onClose={() => setPreviewImage(null)}>
        {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />}
      </Modal>

      <Modal visible={!!pendingPhoto} title="Confirmar envío" icon="fa-image" variant="primary" onClose={() => setPendingPhoto(null)}>
        <div style={{ textAlign: 'center' }}>
          <img src={pendingPhoto || ''} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" icon="fa-times" onClick={cancelPhotoSend}>Cancelar</Button>
            <Button variant="success" icon="fa-paper-plane" onClick={confirmPhotoSend}>Enviar</Button>
          </div>
        </div>
      </Modal>

      {activeCall && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
              <i className="fas fa-user" style={{ fontSize: 50, color: 'white' }} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 10 }}>{activeCall.name}</div>
            <div style={{ fontSize: 16, color: COLORS.gray400, marginBottom: 20 }}>{activeCall.type === 'group' ? 'Llamada grupal' : 'Llamada de voz'}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: COLORS.green, fontFamily: 'monospace' }}>
              {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 40 }}>
              <button onClick={() => { if (callIntervalRef.current) clearInterval(callIntervalRef.current); setActiveCall(null); setCallDuration(0); playAlarm({ volume: 0.2 }); }} style={{ width: 70, height: 70, borderRadius: '50%', background: COLORS.red, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-phone-slash" style={{ fontSize: 28, color: 'white' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal visible={showQRScanner} title="Escanear QR" icon="fa-qrcode" variant="primary" onClose={() => setShowQRScanner(false)}>
        <SimpleQRScanner onScan={handleQRScan} onClose={() => setShowQRScanner(false)} />
      </Modal>

      <Modal visible={showQRCode} title={qrScannerTarget === 'group' ? 'Código QR del Grupo' : 'Tu Código QR'} icon="fa-qrcode" variant="primary" onClose={() => setShowQRCode(false)}>
        <div style={{ textAlign: 'center' }}>
          {qrCodeData && <QRCodeGenerator data={qrCodeData} />}
          <p style={{ fontSize: 12, color: COLORS.gray500, marginBottom: 15 }}>Comparte este código para que otros se unan</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" icon="fa-times" onClick={() => setShowQRCode(false)}>Cerrar</Button>
            <Button variant="primary" icon="fa-share" onClick={() => { navigator.clipboard.writeText(qrCodeData); showToast('URL copiada', 'success'); }}>Copiar</Button>
          </div>
        </div>
      </Modal>

      <FilePreviewModal
        visible={!!pendingFile}
        file={pendingFile?.file || null}
        onConfirm={handleConfirmFileSend}
        onCancel={handleCancelFileSend}
      />
    </div>
  );
};