import { useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const NavItem = ({ 
  icon, 
  label, 
  active, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  active: boolean; 
  onPress: () => void;
}) => {
  const scale = useRef(new Animated.Value(active ? 1.1 : 1)).current;
  
  useEffect(() => {
    const animation = Animated.spring(scale, {
      toValue: active ? 1.1 : 1,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [active, scale]);

  return (
    <TouchableOpacity 
      style={[styles.navItem, active && styles.activeNavItem]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
        <FontAwesome5 
          name={icon} 
          size={20} 
          color={active ? '#FFFFFF' : '#6B7280'}
        />
      </Animated.View>
      {active && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function GlobalNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Map paths to tab names
  const getActiveTab = (path: string) => {
    if (path.startsWith('/admin')) return 'admin';
    if (path.includes('loan')) return 'loans';
    if (path.includes('project')) return 'projects';
    if (path.includes('analytics')) return 'analytics';
    return 'home';
  };

  const activeTab = getActiveTab(pathname);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const role = await AsyncStorage.getItem('role');
        setIsAdmin(role === 'ADMIN');
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const navigate = (tab: string) => {
    const routes: Record<string, string> = {
      'home': '/(tabs)',
      'loans': '/(tabs)/loan-services',
      'projects': '/(tabs)/project-services',
      'analytics': '/(tabs)/analytics',
      'admin': '/admin/admin-dashboard'
    };
    
    const route = routes[tab] || '/(tabs)';
    router.push(route as any);
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <NavItem 
          icon="home" 
          label="Home" 
          active={activeTab === 'home'} 
          onPress={() => navigate('home')} 
        />
        <NavItem 
          icon="file-invoice-dollar" 
          label="Loans" 
          active={activeTab === 'loans'} 
          onPress={() => navigate('loans')} 
        />
        <NavItem 
          icon="project-diagram" 
          label="Projects" 
          active={activeTab === 'projects'} 
          onPress={() => navigate('projects')} 
        />
        <NavItem 
          icon="chart-line" 
          label="Analytics" 
          active={activeTab === 'analytics'} 
          onPress={() => navigate('analytics')} 
        />
        {isAdmin && (
          <NavItem 
            icon="user-shield" 
            label="Admin" 
            active={activeTab === 'admin'} 
            onPress={() => navigate('admin')} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 60,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeNavItem: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});
