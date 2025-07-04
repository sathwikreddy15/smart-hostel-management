export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateMobileNumber = (mobile: string): boolean => {
    const re = /^\d{10}$/;
    return re.test(mobile);
};

export const validateRollNumber = (rollNumber: string): boolean => {
    // Assuming roll number format: 2 digits year + 2 digits branch code + 3 digits number
    const re = /^\d{7}$/;
    return re.test(rollNumber);
};

export const validateName = (name: string): boolean => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

export const validateDates = (startDate: Date | string, endDate: Date | string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
};

export const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong',
    message: string
} => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasLower, hasUpper, hasNumber, hasSpecial]
        .filter(Boolean).length;

    if (password.length < 6) {
        return {
            strength: 'weak',
            message: 'Password must be at least 6 characters long'
        };
    }

    if (score === 4) {
        return {
            strength: 'strong',
            message: 'Strong password'
        };
    }

    if (score >= 2) {
        return {
            strength: 'medium',
            message: 'Medium strength password'
        };
    }

    return {
        strength: 'weak',
        message: 'Weak password'
    };
};

export const validateComplaint = (complaint: {
    title: string;
    type: string;
    description: string;
}): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!complaint.title.trim()) {
        errors.title = 'Title is required';
    } else if (complaint.title.length < 5) {
        errors.title = 'Title must be at least 5 characters long';
    }

    if (!complaint.type) {
        errors.type = 'Type is required';
    }

    if (!complaint.description.trim()) {
        errors.description = 'Description is required';
    } else if (complaint.description.length < 20) {
        errors.description = 'Description must be at least 20 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 