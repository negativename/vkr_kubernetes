#!/bin/bash

# Установка Kubectl
echo "Устанавливаем kubectl..."
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Установка Minikube
echo "Устанавливаем Minikube..."
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube
sudo mv minikube /usr/local/bin/

# Установка VirtualBox
echo "Устанавливаем VirtualBox..."
sudo apt update
sudo apt install -y virtualbox virtualbox-ext-pack

# Запуск Minikube
echo "Запускаем Minikube..."
minikube start --driver=virtualbox

# Применение RBAC конфигураций
echo "Применяем RBAC конфигурации..."
kubectl apply -f service-account.yaml
kubectl apply -f role.yaml
kubectl apply -f role-binding.yaml
kubectl apply -f gitlab-ci-token.yaml
kubectl apply -f gitlab-runner-role.yaml
kubectl apply -f rbac.yaml
kubectl apply -f registry-service.yaml
kubectl apply -f registry-pod.yaml

# Установка и проверка статуса Minikube
minikube status
