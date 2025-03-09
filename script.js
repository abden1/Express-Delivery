// script.js

// ---------- Event Listeners ----------
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء شاشة التحميل
    hideLoader();
    
    // تفعيل القائمة للموبايل
    initializeMobileMenu();
    
    // تفعيل التحريك عند السكرول
    initializeScrollAnimations();
    
    // تفعيل التحقق من النماذج
    initializeFormValidation();
});

// ---------- Loader Functions ----------
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// ---------- Mobile Menu Functions ----------
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// ---------- Scroll Animations ----------
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('counter')) {
                    startCounting(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1
    });

    // مراقبة العناصر المتحركة
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ---------- Form Validation ----------
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                handleFormSubmit(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    // حذف رسائل الخطأ السابقة
    form.querySelectorAll('.error-message').forEach(err => err.remove());
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

    // التحقق من الحقول المطلوبة
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'هذا الحقل مطلوب');
            isValid = false;
        }
    });

    // التحقق من صحة البريد الإلكتروني
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showError(emailField, 'بريد إلكتروني غير صحيح');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

// ---------- Form Submission ----------
function handleFormSubmit(form) {
    // إظهار حالة التحميل
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';

    // محاكاة إرسال النموذج
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        showSuccessMessage('تم إرسال النموذج بنجاح!');
        form.reset();
    }, 1500);
}

// ---------- Tracking System ----------
function trackShipment() {
    const trackingNumber = document.getElementById('tracking-number').value;
    if (!trackingNumber) {
        showError(document.getElementById('tracking-number'), 'الرجاء إدخال رقم التتبع');
        return;
    }

    // محاكاة تتبع الشحنة
    const statuses = [
        { status: 'تم استلام الطلب', icon: 'fa-box' },
        { status: 'في المستودع', icon: 'fa-warehouse' },
        { status: 'جاري التوصيل', icon: 'fa-truck' },
        { status: 'تم التسليم', icon: 'fa-check-circle' }
    ];

    const trackingStatus = document.getElementById('tracking-status');
    trackingStatus.innerHTML = ''; // مسح النتائج السابقة

    statuses.forEach((status, index) => {
        setTimeout(() => {
            addStatusToTimeline(status, trackingStatus);
        }, index * 1000);
    });
}

function addStatusToTimeline(status, container) {
    const statusElement = document.createElement('div');
    statusElement.className = 'status-item';
    statusElement.innerHTML = `
        <div class="status-icon">
            <i class="fas ${status.icon}"></i>
        </div>
        <div class="status-content">
            <h3>${status.status}</h3>
            <p>${new Date().toLocaleString('ar-SA')}</p>
        </div>
    `;
    
    container.appendChild(statusElement);
    setTimeout(() => statusElement.classList.add('active'), 100);
}

// ---------- Price Calculator ----------
function calculatePrice() {
    const fromCity = document.getElementById('from-city').value;
    const toCity = document.getElementById('to-city').value;
    const weight = parseFloat(document.getElementById('weight').value) || 0;

    if (!weight) {
        showError(document.getElementById('weight'), 'الرجاء إدخال الوزن');
        return;
    }

    let basePrice = fromCity === toCity ? 50 : 100;
    let totalPrice = basePrice + (weight * 10);

    // إظهار النتيجة
    const resultDiv = document.getElementById('price-result');
    resultDiv.innerHTML = `
        <div class="price-result-box">
            <h3>تكلفة الشحن المقدرة</h3>
            <div class="calculated-price">${totalPrice} ريال</div>
            <p>تشمل التكلفة ضريبة القيمة المضافة</p>
        </div>
    `;
}

// ---------- Utility Functions ----------
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// ---------- FAQ Toggle ----------
function toggleFaq(element) {
    element.classList.toggle('active');
    const answer = element.nextElementSibling;
    
    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
    }
}

// ---------- Services Tabs ----------
function switchTab(tabId) {
    // إخفاء كل المحتوى
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إظهار المحتوى المطلوب
    document.getElementById(tabId).classList.add('active');
    
    // تحديث الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// script.js
function trackShipment() {
    const trackingNumber = document.getElementById('tracking-number').value;
    const errorElement = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    
    // التحقق من رقم التتبع
    if (!trackingNumber) {
        showError('الرجاء إدخال رقم التتبع');
        return;
    }
    
    if (!/^\d{10}$/.test(trackingNumber)) {
        showError('رقم التتبع يجب أن يتكون من 10 أرقام');
        return;
    }
    
    // إخفاء الخطأ وإظهار النتائج
    errorElement.style.display = 'none';
    resultSection.classList.remove('hidden');
    
    // تحديث معلومات الشحنة
    updateShipmentInfo(trackingNumber);
    
    // إضافة مراحل التتبع
    addTrackingStages();
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function updateShipmentInfo(trackingNumber) {
    document.getElementById('shipment-id').textContent = trackingNumber;
    document.getElementById('shipment-status').textContent = 'في الطريق';
    document.getElementById('shipment-date').textContent = '2024-01-07';
    document.getElementById('shipment-city').textContent = 'الرياض';
}

function addTrackingStages() {
    const timeline = document.getElementById('shipment-timeline');
    timeline.innerHTML = '';
    
    const stages = [
        {
            title: 'تم استلام الطلب',
            date: '2024-01-07 09:00',
            location: 'مركز الفرز - جدة',
            icon: 'fa-box'
        },
        {
            title: 'جاري التجهيز',
            date: '2024-01-07 11:30',
            location: 'مستودع جدة',
            icon: 'fa-warehouse'
        },
        {
            title: 'في الطريق',
            date: '2024-01-07 14:00',
            location: 'على الطريق إلى الرياض',
            icon: 'fa-truck'
        }
    ];
    
    stages.forEach((stage, index) => {
        setTimeout(() => {
            addTimelineItem(stage);
        }, index * 1000);
    });
}

function addTimelineItem(stage) {
    const timeline = document.getElementById('shipment-timeline');
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    item.innerHTML = `
        <div class="timeline-icon">
            <i class="fas ${stage.icon}"></i>
        </div>
        <div class="timeline-content">
            <h3>${stage.title}</h3>
            <p><i class="fas fa-clock"></i> ${stage.date}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${stage.location}</p>
        </div>
    `;
    
    timeline.appendChild(item);
    setTimeout(() => item.classList.add('active'), 100);
}

document.querySelector('.mobile-menu').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
});