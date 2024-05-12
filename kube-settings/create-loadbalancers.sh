#!/bin/bash

# Получение списка всех работающих подов в namespace по умолчанию
echo "Получаем список работающих подов..."
PODS=$(kubectl get pods --field-selector=status.phase=Running -o=jsonpath='{.items[*].metadata.name}')

# Проверка, есть ли работающие поды
if [ -z "$PODS" ]; then
    echo "Работающие поды не найдены. Ничего не делаем."
else
    echo "Найдены работающие поды: $PODS"
    for POD in $PODS; do
        # Создание имени для сервиса Load Balancer на основе имени пода
        LB_NAME="${POD}-loadbalancer"
        
        # Проверка, существует ли уже сервис Load Balancer для этого пода
        if kubectl get svc | grep -q "$LB_NAME"; then
            echo "Сервис Load Balancer для пода $POD уже существует."
        else
            echo "Создаем Load Balancer для пода $POD..."
            # Создание сервиса Load Balancer для пода
            kubectl expose pod $POD --type=LoadBalancer --name=$LB_NAME
            echo "Сервис Load Balancer $LB_NAME создан."
        fi
    done
fi
