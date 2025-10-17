# 🧩 Component Usage Examples

This document provides practical examples of how to use each component in the design system.

## Button Examples

### Basic Buttons
```jsx
import { Button } from './components/common';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Secondary button
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Success button
<Button variant="success" onClick={handleSuccess}>
  Complete
</Button>
```

### Button Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Button States
```jsx
// Loading state
<Button loading={isLoading} onClick={handleSubmit}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// Disabled state
<Button disabled={!isValid} onClick={handleSubmit}>
  Submit
</Button>
```

### Icon Buttons
```jsx
import { IconButton } from './components/common';

<IconButton
  icon={<CloseIcon />}
  variant="ghost"
  onClick={handleClose}
  aria-label="Close"
/>
```

### Button Groups
```jsx
import { ButtonGroup } from './components/common';

<ButtonGroup>
  <Button variant="primary">First</Button>
  <Button variant="secondary">Second</Button>
  <Button variant="secondary">Third</Button>
</ButtonGroup>
```

## Form Examples

### Basic Form with Validation
```jsx
import { Form, useForm, FormInput, FormSelect, Button } from './components/common';

function UserForm() {
  const validationRules = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', length: 2, message: 'Name must be at least 2 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email' }
    ],
    role: [
      { type: 'required', message: 'Role is required' }
    ]
  };

  const form = useForm({
    name: '',
    email: '',
    role: ''
  }, validationRules);

  const handleSubmit = async (values) => {
    try {
      await api.create('users', values);
      alert('User created successfully!');
      form.reset();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormInput
        name="name"
        label="Full Name"
        required
        placeholder="Enter full name"
        form={form}
      />
      
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        required
        placeholder="Enter email address"
        form={form}
      />
      
      <FormSelect
        name="role"
        label="Role"
        required
        placeholder="Select a role"
        options={[
          { value: 'admin', label: 'Administrator' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'student', label: 'Student' }
        ]}
        form={form}
      />
      
      <div className="flex space-x-4">
        <Button type="submit" loading={form.loading}>
          Create User
        </Button>
        <Button type="button" variant="secondary" onClick={form.reset}>
          Reset
        </Button>
      </div>
    </Form>
  );
}
```

### Advanced Form with Custom Fields
```jsx
import { Form, useForm, FormInput, FormTextarea, FormCheckbox, Button } from './components/common';

function ContactForm() {
  const form = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false
  });

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    // Handle form submission
  };

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="name"
          label="Full Name"
          required
          form={form}
        />
        
        <FormInput
          name="email"
          label="Email"
          type="email"
          required
          form={form}
        />
      </div>
      
      <FormInput
        name="subject"
        label="Subject"
        required
        form={form}
      />
      
      <FormTextarea
        name="message"
        label="Message"
        required
        rows={6}
        placeholder="Enter your message here..."
        form={form}
      />
      
      <FormCheckbox
        name="newsletter"
        label="Subscribe to our newsletter"
        form={form}
      />
      
      <Button type="submit" variant="primary" size="lg">
        Send Message
      </Button>
    </Form>
  );
}
```

## Card Examples

### Basic Cards
```jsx
import { Card, CardHeader, CardBody, CardFooter } from './components/common';

<Card>
  <CardHeader title="Card Title" subtitle="Card subtitle" />
  <CardBody>
    <p>This is the card content.</p>
  </CardBody>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>
```

### Stat Cards
```jsx
import { StatCard } from './components/common';

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard
    title="Total Users"
    value="1,234"
    change="+12%"
    changeType="positive"
    icon={<span className="text-2xl">👥</span>}
  />
  
  <StatCard
    title="Revenue"
    value="$12,345"
    change="-5%"
    changeType="negative"
    icon={<span className="text-2xl">💰</span>}
  />
  
  <StatCard
    title="Orders"
    value="89"
    change="0%"
    changeType="neutral"
    icon={<span className="text-2xl">📦</span>}
  />
</div>
```

### Feature Cards
```jsx
import { FeatureCard } from './components/common';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FeatureCard
    title="Easy to Use"
    description="Intuitive interface designed for all skill levels"
    icon={<span className="text-4xl">🎯</span>}
  />
  
  <FeatureCard
    title="Secure"
    description="Enterprise-grade security and data protection"
    icon={<span className="text-4xl">🔒</span>}
  />
  
  <FeatureCard
    title="Fast"
    description="Lightning-fast performance and response times"
    icon={<span className="text-4xl">⚡</span>}
  />
</div>
```

## Table Examples

### Basic Data Table
```jsx
import { DataTable } from './components/common';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { 
    key: 'actions', 
    header: 'Actions',
    render: (value, row) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">Edit</Button>
        <Button size="sm" variant="error">Delete</Button>
      </div>
    )
  }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' }
];

<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  emptyMessage="No users found"
/>
```

### Sortable Table
```jsx
import { DataTable } from './components/common';

function SortableUserTable() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      sortable: true,
      sortDirection: sortConfig.key === 'name' ? sortConfig.direction : null,
      onSort: () => handleSort('name')
    },
    { 
      key: 'email', 
      header: 'Email',
      sortable: true,
      sortDirection: sortConfig.key === 'email' ? sortConfig.direction : null,
      onSort: () => handleSort('email')
    },
    { key: 'role', header: 'Role' }
  ];
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  return (
    <DataTable
      columns={columns}
      data={sortedData}
    />
  );
}
```

## Modal Examples

### Basic Modal
```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from './components/common';

function UserModal({ isOpen, onClose, user }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader 
        title="User Details" 
        subtitle={`Information for ${user?.name}`}
        onClose={onClose}
      />
      <ModalBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary">
          Edit User
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### Confirmation Modal
```jsx
import { ConfirmationModal } from './components/common';

function DeleteUserModal({ isOpen, onClose, onConfirm, userName }) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete User"
      message={`Are you sure you want to delete ${userName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="error"
    />
  );
}
```

## Loading Examples

### Loading States
```jsx
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton } from './components/common';

// Simple spinner
<div className="flex justify-center items-center py-8">
  <LoadingSpinner size="lg" color="primary" />
</div>

// Loading overlay
<LoadingOverlay loading={isLoading} message="Loading user data...">
  <UserProfile user={user} />
</LoadingOverlay>

// Skeleton loading
<LoadingSkeleton lines={4} />
```

### Loading Button
```jsx
import { LoadingButton } from './components/common';

<LoadingButton
  loading={isSubmitting}
  loadingText="Saving..."
  onClick={handleSubmit}
>
  Save Changes
</LoadingButton>
```

## Alert Examples

### Alert Messages
```jsx
import { Alert } from './components/common';

// Success alert
<Alert type="success" title="Success!" dismissible onDismiss={handleDismiss}>
  Your changes have been saved successfully.
</Alert>

// Error alert
<Alert type="error" title="Error" dismissible onDismiss={handleDismiss}>
  Something went wrong. Please try again.
</Alert>

// Warning alert
<Alert type="warning" title="Warning" dismissible onDismiss={handleDismiss}>
  This action cannot be undone.
</Alert>

// Info alert
<Alert type="info" title="Information" dismissible onDismiss={handleDismiss}>
  Here's some helpful information.
</Alert>
```

### Toast Notifications
```jsx
import { Toast, ToastContainer } from './components/common';

function NotificationSystem() {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const showSuccess = () => {
    addToast({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully',
      duration: 5000
    });
  };
  
  return (
    <div>
      <Button onClick={showSuccess}>Show Success Toast</Button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
```

## Complex Component Combinations

### Dashboard with Multiple Components
```jsx
import { 
  Card, 
  StatCard, 
  DataTable, 
  Button, 
  Alert,
  LoadingOverlay 
} from './components/common';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' }
  ];
  
  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<span className="text-2xl">👥</span>}
        />
        <StatCard
          title="Active Users"
          value={users.filter(u => u.status === 'active').length}
          icon={<span className="text-2xl">✅</span>}
        />
        <StatCard
          title="New This Month"
          value={users.filter(u => isNewThisMonth(u.createdAt)).length}
          icon={<span className="text-2xl">🆕</span>}
        />
      </div>
      
      {/* Users Table */}
      <Card>
        <CardHeader 
          title="Users" 
          action={
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          }
        />
        <CardBody>
          <LoadingOverlay loading={loading} message="Loading users...">
            <DataTable
              columns={columns}
              data={users}
              emptyMessage="No users found"
            />
          </LoadingOverlay>
        </CardBody>
      </Card>
    </div>
  );
}
```

### Form with Modal and Validation
```jsx
import { 
  Modal, 
  Form, 
  useForm, 
  FormInput, 
  FormSelect, 
  Button,
  Alert 
} from './components/common';

function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  
  const form = useForm({
    name: '',
    email: '',
    role: ''
  }, {
    name: [{ type: 'required', message: 'Name is required' }],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    role: [{ type: 'required', message: 'Role is required' }]
  });
  
  const handleSubmit = async (values) => {
    try {
      const newUser = await api.create('users', values);
      setUsers(prev => [...prev, newUser]);
      setShowModal(false);
      form.reset();
      setAlert({ type: 'success', message: 'User created successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create user' });
    }
  };
  
  return (
    <div>
      {alert && (
        <Alert 
          type={alert.type} 
          dismissible 
          onDismiss={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
      
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add User
      </Button>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader title="Add New User" />
        <ModalBody>
          <Form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormInput
              name="name"
              label="Full Name"
              required
              form={form}
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              required
              form={form}
            />
            <FormSelect
              name="role"
              label="Role"
              required
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'user', label: 'User' }
              ]}
              form={form}
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={form.handleSubmit(handleSubmit)}
            loading={form.loading}
          >
            Create User
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
```

These examples demonstrate how to use the design system components effectively in real-world scenarios. Each example shows best practices for component composition, state management, and user experience.
