import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { 
  collection, 
  query, 
  where, 
  addDoc, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../../services/firebase/config';
import { 
  CustomText, 
  CustomInput, 
  CustomButton, 
  Card 
} from '../../components/common';
import { colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/helpers';

// Memoized Group Card Component
const GroupCard = memo(({ item, onPress }) => (
  <Card style={styles.groupCard} onPress={onPress}>
    <CustomText style={styles.groupName}>{item.name}</CustomText>
    <CustomText style={styles.groupDescription}>{item.description}</CustomText>
    <View style={styles.groupStats}>
      <CustomText>
        Monthly: {formatCurrency(item.monthlyContribution)}
      </CustomText>
      <CustomText>
        Members: {item.membersCount}
      </CustomText>
    </View>
  </Card>
));

// Create Group Modal Component
const CreateGroupModal = ({ visible, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyContribution: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.monthlyContribution) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onCreate(formData);
      setFormData({ name: '', description: '', monthlyContribution: '' });
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomText style={styles.modalTitle}>Create New Group</CustomText>
          
          <CustomInput
            placeholder="Group Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <CustomInput
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
          />

          <CustomInput
            placeholder="Monthly Contribution"
            value={formData.monthlyContribution}
            onChangeText={(text) => handleChange('monthlyContribution', text)}
            keyboardType="numeric"
          />

          <View style={styles.modalButtons}>
            <CustomButton
              title="Cancel"
              onPress={onClose}
              type="secondary"
              disabled={loading}
            />
            <CustomButton
              title={loading ? 'Creating...' : 'Create'}
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>

          {loading && (
            <ActivityIndicator 
              style={styles.loader} 
              color={colors.primary} 
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const groupsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGroups(groupsData);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        Alert.alert('Error', 'Failed to load groups');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCreateGroup = async (formData) => {
    const newGroupData = {
      name: formData.name,
      description: formData.description,
      monthlyContribution: parseFloat(formData.monthlyContribution),
      members: [auth.currentUser.uid],
      membersCount: 1,
      createdAt: serverTimestamp(),
      adminId: auth.currentUser.uid
    };

    await addDoc(collection(db, 'groups'), newGroupData);
  };

  const renderGroup = useCallback(({ item }) => (
    <GroupCard
      item={item}
      onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
    />
  ), [navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <CustomText style={styles.emptyText}>
            No groups found. Create one to get started!
          </CustomText>
        )}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <CustomText style={styles.fabText}>+</CustomText>
      </TouchableOpacity>

      <CreateGroupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateGroup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  groupCard: {
    padding: 16,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDescription: {
    marginTop: 4,
    color: colors.gray,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: colors.white,
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  loader: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 20,
  },
});